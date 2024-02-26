"use client"
import { useCart } from "@/providers/CartProvider"
import { Product } from "@/types/products"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { AspectRatio, Button, Card, CardContent, CardOverflow, Chip, Grid, Typography } from "@mui/joy"
import { Rating } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { numericFormatter } from "react-number-format"
export default function ProductCard({ product }: {
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
                    <CardContent sx={{marginY: 1}}>

                        <Typography level="title-lg">
                            {product.name}
                        </Typography>
                        <Typography level="body-sm">
                            {product.category}
                        </Typography>
                        <Rating value={product.review_score} precision={0.1} readOnly size="small" sx={{
                            marginY: 1
                        
                        }} />
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid>
                                <Typography
                                    level="body-md"

                                >
                                    {
                                        numericFormatter(product.price.toString(), {
                                            thousandSeparator: ' ',
                                            suffix: ' SEK',
                                        })
                                    }
                                </Typography>
                            </Grid>
                            <Grid>
                                {
                                    product.quantity > 0 ?
                                        <Chip color="success">In stock</Chip> :
                                        <Chip color="danger">Out of stock</Chip>
                                }
                            </Grid>
                        </Grid>

                    </CardContent>
                </Link>
            </CardOverflow>
            <CardOverflow>
                <Button
                    variant="solid"
                    size="lg"
                    endDecorator={<AddShoppingCartIcon />}
                    onClick={() => cart.addToCart(product)}
                >
                    Add to cart
                </Button>
            </CardOverflow>
        </Card>
    )
}