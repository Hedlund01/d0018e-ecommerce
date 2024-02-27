"use client"
import { OrderLine } from "@/types/order_line"
import { Product } from "@/types/products"
import { AspectRatio, Card, CardContent, CardOverflow, Typography } from "@mui/joy"
import Image from "next/image"
import Link from "next/link"
import { numericFormatter } from "react-number-format"
export default function OrderProductCard({ product, orderLine }: {
    product: Product;
    orderLine: OrderLine;
}) {
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
                            Quantity: {orderLine.quantity}
                        </Typography>
                        <Typography
                            level="body-md"
                        >
                            price: {
                                numericFormatter(orderLine.price.toString(), {
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