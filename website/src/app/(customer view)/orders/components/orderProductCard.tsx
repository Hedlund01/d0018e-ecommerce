"use client"
import { useCart } from "@/providers/CartProvider"
import { Product } from "@/types/products"
import { AspectRatio, Card, CardContent, CardOverflow, Typography } from "@mui/joy"
import Image from "next/image"
import Link from "next/link"
import { numericFormatter } from "react-number-format"
export default function OrderProductCard({ product }: {
    product: Product
}) {
    const cart = useCart();
    return (
        <Card sx={{ boxShadow: 'lg' }} >
            <CardOverflow>
                <Link href={`/products/${product.id}`} style={{ margin: 0, padding: 0, textDecoration: 'none' }} prefetch>
                    <CardOverflow >
                        <AspectRatio >
                            <Image
                                src={product.image}
                                alt={product.name + " image"}
                                fill
                                priority
                            />
                        </AspectRatio>
                    </CardOverflow>
                    <CardContent sx={{ marginY: 1 }}>

                        <Typography level="title-lg">
                            {product.name}
                        </Typography>
                        <Typography level="body-sm">
                            {product.category}
                        </Typography>

                        <Typography level="body-md">
                            Quantity: {product.quantity}
                        </Typography>
                        <Typography
                            level="body-md"
                        >
                            price: {
                                numericFormatter(product.price.toString(), {
                                    thousandSeparator: ' ',
                                    suffix: ' SEK',
                                })
                            }
                        </Typography>




                    </CardContent>
                </Link>
            </CardOverflow>

        </Card>
    )
}