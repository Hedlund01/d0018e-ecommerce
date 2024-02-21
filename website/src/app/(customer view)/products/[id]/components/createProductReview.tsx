"use client"
import { currentUserCanRateProduct, reviewProductForCurrentUser } from "@/actions/reviews";
import { useSnackBar } from "@/providers/alertProvider";
import { Button, FormControl, FormHelperText, FormLabel, Sheet, Stack, Textarea, Typography } from "@mui/joy";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";

export default function CreateProductReview(props: {
    productId: number
}) {
    const [canReviewProduct, setCanReviewProduct] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [error, setError] = useState<string>("");
    const snack = useSnackBar();

    useEffect(() => {
        currentUserCanRateProduct(props.productId).then((value) => {
            setCanReviewProduct(value)
        })
    }, [props.productId])

    if (!canReviewProduct) return null;

    function handleAction() {
        reviewProductForCurrentUser(props.productId, review, rating).then((result) => { 
            if (result.success) {
                snack.showSnackBar("Review submitted", "success")
            } else {
                snack.showSnackBar(result.error || "An error occurred", "danger")
            }
        })
    }

    return (
        <>
            <Sheet
                variant="soft"
                sx={{
                    borderRadius: 'sm',
                    padding: '2rem',
                }}>

                <Typography level="h3">
                    Create a review
                </Typography>

                <form action={handleAction}>
                    <Stack spacing={2}>

                        <Rating name="rating" value={rating} onChange={(event, newValue) => {
                            setRating(newValue || 0)
                        }} precision={0.5} sx={{
                            maxWidth: "fit-content"
                        }} />

                        <FormControl>
                            <FormLabel>Label</FormLabel>
                            <Textarea placeholder="Placeholder" minRows={2} value={review} onChange={(event) => setReview(event.target.value)} />
                            <FormHelperText>This is a helper text.</FormHelperText>
                        </FormControl>

                        <Button type="submit">Submit </Button>
                    </Stack>
                </form>

            </Sheet>
        </>

    )
}