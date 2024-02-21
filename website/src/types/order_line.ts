import { z } from "zod";

export const orderLineSchema = z.object({
    productId: z.coerce.number().positive(),
    price: z.coerce.number().nonnegative(),
    quantity: z.number().nonnegative(),
    orderId: z.coerce.number(),
});
export type OrderLine = z.infer<typeof orderLineSchema>;

export const createNewOrderLineSchema = orderLineSchema;
export type CreateNewOrderLine = z.infer<typeof createNewOrderLineSchema>;

export const createUpdateOrderLineSchema = orderLineSchema;
export type CreateUpdateOrderLine = z.infer<typeof createUpdateOrderLineSchema>;
