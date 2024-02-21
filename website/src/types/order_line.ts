import { z } from "zod";

export const orderLineSchema = z.object({
    productId: z.number(),
    price: z.number().nonnegative(),
    quantity: z.number().nonnegative(),
    orderId: z.number(),
});
export type OrderLine = z.infer<typeof orderLineSchema>;

export const createNewOrderLineSchema = orderLineSchema;
export type CreateNewOrderLine = z.infer<typeof createNewOrderLineSchema>;

export const createUpdateOrderLineSchema = orderLineSchema;
export type CreateUpdateOrderLine = z.infer<typeof createUpdateOrderLineSchema>;
