"use client"
import { clearCartCookie, clearCartDB, getCartCookie, getCartDB, removeCartDB, setCartCookie, setCartDB, setQuantityDB } from '@/actions/cart';
import {
    CartLine,
    CartLineProduct,
    Product
} from '@/types/products';
import { AspectRatio, Button, ButtonGroup, DialogContent, DialogTitle, Divider, Drawer, IconButton, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { useSnackBar } from '@/providers/alertProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { createContext, useContext, useEffect } from 'react';
import { numericFormatter } from 'react-number-format';

type CartContextActions = {
    showCart: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (cartLine: CartLine) => void;
    clearCart: () => void;
    setCartLineQuantity: (cartLine: CartLine, quantity: number) => void;
    totalCartQuantity: number;
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
    const [totalCartQuantity, setTotalCartQuantity] = React.useState<number>(0);
    const { data: session, status } = useSession();
    const snack = useSnackBar();

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

    useEffect(() => {
        setTotalCartQuantity(products.reduce((acc, cartLine) => acc + cartLine.quantity, 0))
    }, [products])


    if (status === 'loading') return <>{children}</>;



    const addToCart = (product: CartLineProduct) => {

        const existingProduct = products.find((item) => item.product.id === product.id);
        var storageProducts = null;
        if (existingProduct) {
            console.log(addToCart.name, 'existing product');
            existingProduct.quantity++;

            storageProducts = [...products];
        } else {
            const productToAdd = { product: product, quantity: 1, userId: Number(session?.user.id) } as CartLine

            storageProducts = [...products, productToAdd];
        }
        setProducts(storageProducts);
        snack.showSnackBar(`Product ${product.name} added to the cart`, "success")

        if (status === 'authenticated') {
            setCartDB(storageProducts);
        } else {
            setCartCookie(storageProducts);
        }

    }
    const removeFromCart = (cartLine: CartLine) => {
        setProducts(products.filter((item) => item.product.id !== cartLine.product.id));
        if (status === 'authenticated') {
            removeCartDB(cartLine.product.id);
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
                    setQuantityDB(cartLine.product.id, existingProduct.quantity);
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
        <CartContext.Provider value={{ showCart, addToCart, removeFromCart, clearCart, setCartLineQuantity: setCartLineQuantity, totalCartQuantity }}>
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
                            numericFormatter(products.reduce((acc, cartLine) => acc + cartLine.product.price * cartLine.quantity, 0).toString(), {
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
                        <Link href="/checkout" onClick={() => setOpen(false)}>
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

