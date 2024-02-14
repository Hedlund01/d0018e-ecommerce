import {
    Sheet,
    Typography,
    Stack,
    Input,
    Button,
    FormControl,
    FormLabel,
} from "@mui/joy";
import { forwardRef } from "react";
import { createUpdateOrderSchema } from "@/types/orders";
import { z } from "zod";
import { createOrder, getOrder, updateOrder } from "@/actions/orders";
import { getOrderLines } from "@/actions/orderLines";
import { redirect } from "next/navigation";
import NumericFormatAdapter from "../../create/NumericFormatAdapter";

export default async function Page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const order = await getOrder(params.id);

    async function handleUpdateOrder(
        createdAt: Date | undefined,
        formData: FormData
    ) {
        "use server";
        const orderLines = await getOrderLines(params.id);
        const rawFormData = Object.fromEntries(formData.entries());
        const unparsedOrder = {
            userId: Number(rawFormData.userId),
            createdAt: createdAt,
            updatedAt: new Date(),
            status: rawFormData.status,
            totalPrice: orderLines.reduce(
                (acc, orderLine) =>
                    acc + Number(orderLine.price * orderLine.quantity),
                0
            ),
            totalQuantity: orderLines.reduce(
                (acc, orderLine) => acc + Number(orderLine.quantity),
                0
            ),
        };
        const order = await createUpdateOrderSchema.safeParseAsync(
            unparsedOrder
        );
        if (!order.success) {
            console.log(order.error);
            return;
        }
        await updateOrder(params.id, order.data);
        redirect("/dashboard/orders");
    }

    const formUpdateOrder = handleUpdateOrder.bind(null, order?.createdAt);

    return (
        <>
            <Typography level="h1">Edit Order</Typography>
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "sm",
                    padding: "2rem",
                }}
            >
                <form action={formUpdateOrder}>
                    <Stack spacing={1}>
                        <FormControl>
                            <FormLabel>User Id</FormLabel>
                            <Input
                                name="userId"
                                defaultValue={order?.userId}
                                type="number"
                                required
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Input
                                name="status"
                                defaultValue={order?.status}
                                type="text"
                                required
                            />
                        </FormControl>
                        <Button type="submit">Submit</Button>
                    </Stack>
                </form>
            </Sheet>
        </>
    );
}
