import { z } from "zod";

export const orderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    totalPrice: z.number().nonnegative(),
    totalQuantity: z.number().nonnegative(),
});
export type Order = z.infer<typeof orderSchema>;

export const createNewOrderSchema = orderSchema.omit({ id: true });

export const createUpdateOrderSchema = orderSchema.omit({
    id: true,
    createdat: true,
});

export type CreateNewOrder = z.infer<typeof createNewOrderSchema>;
export type CreateUpdateOrder = z.infer<typeof createUpdateOrderSchema>;
