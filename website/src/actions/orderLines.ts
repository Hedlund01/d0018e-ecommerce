"use server";
import {
    CreateNewOrderLine,
    OrderLine,
    createNewOrderLineSchema,
    orderLineSchema,
} from "@/types/order_line";
import { sql } from "@vercel/postgres";

export async function getOrderLines(orderId: string): Promise<OrderLine[]> {
    const r = await sql`SELECT * FROM order_lines where orderId = ${orderId}`;
    const orderLines = await Promise.all(
        r.rows.map(async (orderLine: any) => {
            orderLine.orderId = parseInt(orderLine.orderid);
            orderLine.productId = parseInt(orderLine.productid);
            orderLine.quantity = parseInt(orderLine.quantity);
            orderLine.price = parseFloat(orderLine.price);
            const parsedOrderLine = await orderLineSchema.safeParseAsync(
                orderLine
            );
            if (!parsedOrderLine.success) {
                console.error(parsedOrderLine.error);
                return null;
            } else {
                return parsedOrderLine.data;
            }
        })
    );

    return orderLines.flatMap((orderLine) =>
        orderLine ? [orderLine] : []
    ) as OrderLine[];
}

export async function deleteOrderLines(lineId: string): Promise<void> {
    await sql`DELETE FROM order_lines WHERE id = ${lineId}`;
}

export async function createOrderLine(
    orderLine: CreateNewOrderLine
): Promise<void> {
    try {
        const parsedOrderLine = await createNewOrderLineSchema.safeParseAsync(
            orderLine
        );
        if (!parsedOrderLine.success) {
            throw new Error(parsedOrderLine.error.message);
        }
        console.log(parsedOrderLine.data);
        await sql`INSERT INTO order_lines (orderId, status, productId, quantity, price) VALUES (${parsedOrderLine.data.orderId}, ${parsedOrderLine.data.status}, ${parsedOrderLine.data.productId}, ${parsedOrderLine.data.quantity}, ${parsedOrderLine.data.price})`;
    } catch (error) {
        console.error(error);
        return;
    }
}
