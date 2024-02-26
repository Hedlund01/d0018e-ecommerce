"use server";
import {
    CreateUpdateOrderLine,
    OrderLine,
    createUpdateOrderLineSchema,
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

export async function deleteOrderLines(productId: string, orderId: string): Promise<void> {
    await sql`DELETE FROM order_lines WHERE orderid=${orderId} AND productid=${productId}`;
}

export async function createOrderLine(
    orderLine: CreateUpdateOrderLine
): Promise<void> {
    try {
        const parsedOrderLine = await createUpdateOrderLineSchema.safeParseAsync(
            orderLine
        );
        if (!parsedOrderLine.success) {
            throw new Error(parsedOrderLine.error.message);
        }
        console.log(parsedOrderLine.data);
        await sql`INSERT INTO order_lines (orderId, productId, quantity, price) VALUES (${parsedOrderLine.data.orderid}, ${parsedOrderLine.data.productid}, ${parsedOrderLine.data.quantity}, ${parsedOrderLine.data.price})
                    ON CONFLICT(productid, orderid) DO UPDATE
                    SET quantity = order_lines.quantity + ${parsedOrderLine.data.quantity}`;
    } catch (error) {
        console.error(error);
        return;
    }
}
