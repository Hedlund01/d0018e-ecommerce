"use client"

import { CartLine } from "@/types/products"
import { AspectRatio, Button, Card, CardContent, CardOverflow, Divider, Stack, Typography } from "@mui/joy"
import useMediaQuery from "@mui/material/useMediaQuery"
import Image from 'next/image'
import { useState } from "react"
import { numericFormatter } from "react-number-format"

export default function CheckoutCartProducts(props: {
    cart: CartLine[]
}) {
    const mobileScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const [showCart, setShowCart] = useState<boolean>(false);
    return (
        <>
            <Stack spacing={3} >
                {
                    mobileScreen &&
                    <Button variant="outlined" onClick={() => setShowCart(!showCart)}>
                        {showCart ? "Hide" : "Show"} products
                    </Button>
                }



                {
                    !mobileScreen || showCart ? (
                        <>
                            <Stack spacing={3} sx={{
                                overflowY: 'scroll',
                                maxHeight: "50vh",
                            }}>
                                {
                                    props.cart.map((cartLine) => {
                                        return (
                                            <Card orientation="horizontal" variant="outlined" key={`cart-product-${cartLine.product.id}`}>
                                                <CardOverflow>
                                                    <AspectRatio ratio="1" sx={{ width: 90 }}>
                                                        <Image
                                                            src={cartLine.product.image}
                                                            alt={cartLine.product.name}
                                                            fill
                                                        />
                                                    </AspectRatio>
                                                </CardOverflow>
                                                <CardContent>
                                                    <Typography level="title-lg" fontWeight="lg">
                                                        {cartLine.product.name}
                                                    </Typography>
                                                    <Typography fontWeight="md">
                                                        {cartLine.quantity} Pcs x {numericFormatter(cartLine.product.price.toString(), {
                                                            thousandSeparator: ' ',
                                                            suffix: ' SEK',
                                                        })}
                                                    </Typography>

                                                </CardContent>

                                            </Card>
                                        )
                                    })
                                }

                            </Stack >

                        </>
                    ) : null
                }



                < Divider />
            </Stack>


        </>
    )
}