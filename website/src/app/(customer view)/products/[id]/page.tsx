"use client"
import { getProduct } from "@/actions/products";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Product } from "@/types/products";
import { Button, Typography } from "@mui/joy";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { numericFormatter } from "react-number-format";
import ProductRecommendations from "./components/productRecommendation";

export default function Page({ params }: {
    params: { id: number }
}) {
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        getProduct(params.id.toString()).then((product) => {
            if (product === undefined) {
                redirect('/products')
            } else {
                setProduct(product)
            }
        })
    }, [])

    if (product === null) {
        return <LoadingIndicator />
    }

    return (
        <>
            <Typography level="h1">
                {product?.name}
            </Typography>
            <Image src={product.image} width={600} height={400} alt={product?.name || ""} priority />
            <Typography fontSize="lg" fontWeight="lg">
                {
                    numericFormatter(product?.price ? product.price.toString() : "", {
                        thousandSeparator: ' ',
                        suffix: ' SEK',
                    })
                }
            </Typography>
            <Typography level="h4">
                {product?.description}
            </Typography>




            <Button variant="solid" color="primary">
                Add to cart
            </Button>


            <ProductRecommendations productCategory={product.category} />
        </>
    )


}