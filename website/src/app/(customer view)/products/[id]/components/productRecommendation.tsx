import { categoryRecommendations } from "@/actions/categoryRecommendations"
import { Product } from "@/types/products"
import { Sheet, Stack, Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import ProductCard from "../../components/ProductCard"
import { useMediaQuery } from "@mui/material"

export default function ProductRecommendations(props: {
    productCategory: string;
    excludeProductIds?: number[];
}) {
    const [recommendations, setRecommendations] = useState<Product[]>([])
    const smallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'))
    useEffect(() => {
        categoryRecommendations(props.productCategory, 10).then((products) => {
            setRecommendations(products.filter((product) => product.id !== props.excludeProductIds?.find((id) => id === product.id)))
        })
    }, [props.productCategory])


    return (
        <>
    

                <Typography level="h4" mb={2}>
                    Other popular products within category {props.productCategory}
                </Typography>
                <Stack spacing={4} direction={smallScreen ? "row": "column"} sx={{overflow: "auto"}}>
                    {recommendations.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Stack>
        </>
    )

}