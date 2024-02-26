import { z } from "zod";

export const orderLineSchema = z.object({
    productid: z.coerce.number().positive(),
    price: z.coerce.number().nonnegative(),
    quantity: z.coerce.number().nonnegative(),
    orderid: z.coerce.number().positive(),
});
export type OrderLine = z.infer<typeof orderLineSchema>;


export const createUpdateOrderLineSchema = orderLineSchema;
export type CreateUpdateOrderLine = z.infer<typeof createUpdateOrderLineSchema>;
