import { categoryRecommendations } from "@/actions/categoryRecommendations"
import { Product } from "@/types/products"
import { Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import ProductCard from "../../components/ProductCard"

export default function ProductRecommendations(props: {
    productCategory: string
}) {
    const [recommendations, setRecommendations] = useState<Product[]>([])

    useEffect(() => {
        categoryRecommendations(props.productCategory).then((products) => {
            setRecommendations(products)
        })
    }, [props.productCategory])


    return (
        <>
            <Typography level="h2">
                Similar products
            </Typography>
            <div style={{ display: "flex", gap: 2, overflowX: "scroll"}}>
                {recommendations.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    )

}