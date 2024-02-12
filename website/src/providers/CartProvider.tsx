"use client"
import { clearCartCookie, clearCartDB, getCartCookie, getCartDB, removeCartDB, setCartCookie, setCartDB, setQuantityDB } from '@/actions/cart';
import {
    CartLine,
    CartLineProduct,
    Product
} from '@/types/products';
import { AspectRatio, Button, ButtonGroup, DialogContent, DialogTitle, Divider, Drawer, IconButton, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import { customAlphabet } from 'nanoid';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import React, { createContext, useContext, useEffect } from 'react';
import { numericFormatter } from 'react-number-format';
import DeleteIcon from '@mui/icons-material/Delete';
type CartContextActions = {
    showCart: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (cartLine: CartLine) => void;
    clearCart: () => void;
    setCartLineQuantity: (cartLine: CartLine, quantity: number) => void;
};

const CartContext = createContext({} as CartContextActions);

interface CartContextProviderProps {
    children: React.ReactNode;
}


const CartProvider: React.FC<CartContextProviderProps> = ({
    children,
}) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [products, setProducts] = React.useState<CartLine[]>([]);
    const { data: session, status } = useSession();
    const nanoid = customAlphabet('1234567890', 20)
    useEffect(() => {
        async function setProductsFromCookie() {
            console.log('setting products from cookie');
            setProducts(await getCartCookie());
        }
        async function setProductsFromDB() {
            console.log('setting products from db')
            const result = await getCartDB();
            setProducts(result);
        }
        if (status === 'authenticated') {
            setProductsFromDB();
        } else if (status === 'unauthenticated') {
            setProductsFromCookie();
        } else {
            setProducts([])
        }
    }, [session?.user.id])


    if (status === 'loading') return <>{children}</>;



    const addToCart = (product: CartLineProduct) => {
        const existingProduct = products.find((item) => item.product.id === product.id);
        var storageProducts = null;
        console.log('adding to cart');
        if (existingProduct) {
            console.log('existing product');
            existingProduct.quantity++;

            storageProducts = [...products];
        } else {
            const productToAdd = { product: product, quantity: 1, userId: Number(session?.user.id) } as CartLine


            storageProducts = [...products, productToAdd];
        }
        console.log(products);
        setProducts(storageProducts);
        if (status === 'authenticated') {
            setCartDB(storageProducts);
        } else {
            setCartCookie(storageProducts);
        }

    }
    const removeFromCart = (cartLine: CartLine) => {
        setProducts(products.filter((item) => item.product.id !== cartLine.product.id));
        if (status === 'authenticated') {
            removeCartDB(cartLine.userId, cartLine.product.id);
        } else {
            setCartCookie(products)

        }
    }

    const setCartLineQuantity = (cartLine: CartLine, quantity: number) => {
        const existingProduct: CartLine | undefined = products.find((item) => item.product.id === cartLine.product.id);
        if (existingProduct) {
            existingProduct.quantity = quantity;
            if (existingProduct.quantity === 0) {
                removeFromCart(cartLine);
            }
            else {
                setProducts([...products]);
                if (status === 'authenticated') {
                    setQuantityDB(cartLine.userId, cartLine.product.id, existingProduct.quantity);
                } else {
                    setCartCookie(products);
                }
            }
        }
    }
    const clearCart = () => {
        setProducts([]);
        if (status === 'authenticated') {
            clearCartDB();
        }
        else {
            clearCartCookie();
        }
    }


    const showCart = () => {
        setOpen(true);
    }





    return (
        <CartContext.Provider value={{ showCart, addToCart, removeFromCart, clearCart, setCartLineQuantity: setCartLineQuantity }}>
            <Drawer
                size='md'
                variant='plain'
                anchor='right'
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'transparent',
                            p: { md: 3, sm: 0 },
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                <Sheet
                    sx={{
                        borderRadius: 'md',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <DialogTitle>Cart</DialogTitle>
                    <ModalClose />
                    <Divider sx={{ mt: 'auto' }} />
                    <DialogContent sx={{ gap: 2 }}>
                        {
                            products.map((cartLine) => {
                                return (
                                    <Sheet key={"cart-product-" + cartLine.userId + "-" + cartLine.product.id} variant='soft' sx={{
                                        p: 2,
                                        borderRadius: 'md',
                                    }}>
                                        <Stack direction="row" spacing={4}>
                                            <AspectRatio ratio={1} sx={{ width: 100 }}>
                                                <Image
                                                    src={cartLine.product.image}
                                                    alt={cartLine.product.name}
                                                    fill
                                                />
                                            </AspectRatio>
                                            
                                            <Stack spacing={1}>
                                                <Typography level='title-lg'>{cartLine.product.name}</Typography>
                                                <Typography level='body-lg'>{numericFormatter(cartLine.product.price.toString(), {
                                                    thousandSeparator: ' ',
                                                    suffix: ' SEK',
                                                })}</Typography>
                                                <ButtonGroup size='sm'>
                                                    <IconButton
                                                        onClick={() => setCartLineQuantity(cartLine, cartLine.quantity - 1)}
                                                    >
                                                        -
                                                    </IconButton>
                                                    <Button disabled>{cartLine.quantity}</Button>
                                                    <IconButton
                                                        onClick={() => setCartLineQuantity(cartLine, cartLine.quantity + 1)}
                                                    >
                                                        +
                                                    </IconButton>
                                                </ButtonGroup>
                                              

                                            </Stack>
                                            <IconButton onClick={() => setCartLineQuantity(cartLine, 0)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>

                                    </Sheet>
                                )
                            })
                        }

                    </DialogContent>

                    <Divider sx={{ mt: 'auto' }} />
                    <Typography level='title-lg'>
                        Total: {
                            numericFormatter(products.reduce((acc, cartLine) => acc + cartLine.product.price, 0).toString(), {
                                thousandSeparator: ' ',
                                suffix: ' SEK',
                            })
                        }
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        useFlexGap
                        spacing={1}
                    >
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => clearCart()}
                        >
                            Clear
                        </Button>
                        <Link href="/checkout">
                            <Button>
                                Checkout
                            </Button>
                        </Link>
                    </Stack>
                </Sheet>
            </Drawer>
            {children}
        </CartContext.Provider >
    );
};

const useCart = (): CartContextActions => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within an CartProvider');
    }

    return context;
};

export { CartProvider, useCart };
