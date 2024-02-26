import {z} from "zod";
export const getReviewDTOSchema = z.object({
    created_at: z.coerce.date(),
    review_text: z.string(),
    rating: z.coerce.number().nonnegative(),
    name: z.string(),
    image: z.string().url().nullish(),
})

export type GetReviewDTO = z.infer<typeof getReviewDTOSchema>

