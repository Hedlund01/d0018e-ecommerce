"use client"
import { currentUserCanRateProduct } from "@/actions/reviews";
import { Sheet, Typography } from "@mui/joy";
import { useState, useEffect } from "react";

export default function CreateProductReview(props: {
    productId: number
}) {
    const [canReviewProduct, setCanReviewProduct] = useState<boolean>(false);

    useEffect(() => {
        currentUserCanRateProduct(props.productId).then((value) => {
            setCanReviewProduct(value)
        })
    }, [props.productId])

    console.log(canReviewProduct)
    if (!canReviewProduct) return null;

    return (
        <>
            <h1>hej</h1>
          <Sheet
                variant="soft"
                sx={{
                    borderRadius: 'sm',
                    padding: '2rem',
                }}>
                
                <Typography level="h3">
                    Create a review
                    </Typography>
                
            </Sheet>
        </>

    )
}