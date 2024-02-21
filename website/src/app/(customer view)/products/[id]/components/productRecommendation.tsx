import { categoryRecommendations } from "@/actions/categoryRecommendations"
import { Product } from "@/types/products"
import { Sheet, Stack, Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import ProductCard from "../../components/ProductCard"

export default function ProductRecommendations(props: {
    productCategory: string
}) {
    const [recommendations, setRecommendations] = useState<Product[]>([])

    useEffect(() => {
        categoryRecommendations(props.productCategory, 10).then((products) => {
            setRecommendations(products)
        })
    }, [props.productCategory])


    return (
        <>
            <Sheet
                variant="soft"
                sx={{
                    borderRadius: 'sm',
                    padding: '2rem',
                    marginY: '2rem'
                }}>

                <Typography level="h3" mb={2}>
                    Other products within category {props.productCategory}
                </Typography>
                <Stack spacing={4} direction="row" sx={{overflowX: "auto"}}>
                    {recommendations.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Stack>
            </Sheet>
        </>
    )

}