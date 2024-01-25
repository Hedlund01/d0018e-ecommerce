import {z} from "zod";

export const productSchema = z.object({
    id: z.number(),
    name: z.string().max(255).min(1), 
    description: z.string(),
    price: z.number().nonnegative(),
    image: z.string().url(),
    quantity: z.number().nonnegative()
});
export type Product = z.infer<typeof productSchema>;

export const createUpdateProductSchema = productSchema.omit({ id: true });
export type CreateUpdateProduct = z.infer<typeof createUpdateProductSchema>;