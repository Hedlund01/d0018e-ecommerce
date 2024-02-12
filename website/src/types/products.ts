import {z} from "zod";
import { userSchema } from "./user";

export const productSchema = z.object({
    id: z.number(),
    name: z.string().max(255).min(1), 
    description: z.string(),
    price: z.number().nonnegative(),
    image: z.string().url(),
    quantity: z.number().nonnegative()
});
export type Product = z.infer<typeof productSchema>;

export const cartLineProductSchema = productSchema.omit({ quantity: true, description: true });

export type CartLineProduct = z.infer<typeof cartLineProductSchema>;

export const cartLineSchema = z.object({
    userId: z.number().positive(),
    product: cartLineProductSchema,
    quantity: z.number().nonnegative(),
});

export type CartLine = z.infer<typeof cartLineSchema>;



export const createUpdateProductSchema = productSchema.omit({ id: true });
export type CreateUpdateProduct = z.infer<typeof createUpdateProductSchema>;