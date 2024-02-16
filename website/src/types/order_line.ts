import { z } from "zod";

export const orderLineSchema = z.object({
    id: z.number(),
    productId: z.number(),
    status: z.string(),
    price: z.number().nonnegative(),
    quantity: z.number().nonnegative(),
    orderId: z.number(),
});
export type OrderLine = z.infer<typeof orderLineSchema>;

export const createNewOrderLineSchema = orderLineSchema.omit({ id: true });
export type CreateNewOrderLine = z.infer<typeof createNewOrderLineSchema>;

export const createUpdateOrderLineSchema = orderLineSchema.omit({ id: true });
export type CreateUpdateOrderLine = z.infer<typeof createUpdateOrderLineSchema>;
