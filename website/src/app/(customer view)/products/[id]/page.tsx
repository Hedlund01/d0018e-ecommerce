"use client"
import { getProduct } from "@/actions/products";
import { Typography, Sheet, Button } from "@mui/joy";
import { redirect } from "next/navigation";
import Image from "next/image";
import { numericFormatter } from "react-number-format";
import { useEffect, useState } from "react";
import { Product } from "@/types/products";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function Page({ params }: {
    params: { id: number }
}) {
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        getProduct(params.id.toString()).then((product) => {
            if(product === undefined) {
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
            <Image src={product.image} width={600} height={400} alt={product?.name || ""} priority/>
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
        
            
        
        </>
    )


}