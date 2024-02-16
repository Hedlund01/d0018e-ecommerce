"use server";

import {
    CreateNewOrder,
    CreateUpdateOrder,
    createUpdateOrderSchema,
    createNewOrderSchema,
} from "@/types/orders";
import { Order, orderSchema } from "@/types/orders";
import { sql } from "@vercel/postgres";
import { z } from "zod";

export async function getOrders(): Promise<Order[]> {
    const result = await sql`SELECT * FROM orders`;
    const orders = await Promise.all(
        result.rows.map(async (order: any) => {
            order.userId = parseInt(order.userid);
            order.totalQuantity = parseInt(order.totalquantity);
            order.totalPrice = parseFloat(order.totalprice);
            order.createdAt = new Date(order.createdat);
            order.updatedAt = new Date(order.updatedat);
            const parsedOrder = await orderSchema.safeParseAsync(order);
            if (!parsedOrder.success) {
                console.error(parsedOrder.error);
                return null;
            } else {
                return parsedOrder.data;
            }
        })
    );
    return orders.flatMap((order) => (order ? [order] : [])) as Order[];
}

export async function getOrder(id: string): Promise<Order | undefined> {
    try {
        const order = await sql`SELECT * FROM orders WHERE id = ${id}`;
        order.rows[0].userId = parseInt(order.rows[0].userid);
        order.rows[0].totalQuantity = parseInt(order.rows[0].totalquantity);
        order.rows[0].totalPrice = parseFloat(order.rows[0].totalprice);
        order.rows[0].createdAt = new Date(order.rows[0].createdat);
        order.rows[0].updatedAt = new Date(order.rows[0].updatedat);
        const parsedOrder = await orderSchema.parseAsync(order.rows[0]);
        return parsedOrder;
    } catch (error) {
        console.error(error);
        return;
    }
}

export async function createOrder(order: CreateNewOrder): Promise<void> {
    try {
        const parsedOrder = await createNewOrderSchema.safeParseAsync(order);
        if (!parsedOrder.success) {
            throw new Error(parsedOrder.error.message);
        }
        await sql`INSERT INTO Orders (userId, createdAt, updatedAt, status, totalPrice, totalQuantity) 
        VALUES ( ${
            parsedOrder.data.userId
        }, ${parsedOrder.data.createdAt.toISOString()}, ${parsedOrder.data.updatedAt.toISOString()}, 
            ${parsedOrder.data.status}, ${parsedOrder.data.totalPrice}, ${
            parsedOrder.data.totalQuantity
        })`;
    } catch (error) {
        console.log(error);
    }
}

export async function updateOrder(
    id: string,
    order: CreateUpdateOrder
): Promise<void> {
    try {
        const parsedOrder = await createUpdateOrderSchema.safeParseAsync(order);
        if (!parsedOrder.success) {
            throw new Error(parsedOrder.error.message);
        }
        await sql`UPDATE orders SET 
        userId=${
            parsedOrder.data.userId
        }, updatedAt=${parsedOrder.data.updatedAt.toISOString()}, 
        status=${parsedOrder.data.status}, totalPrice=${
            parsedOrder.data.totalPrice
        }, totalQuantity=${parsedOrder.data.totalQuantity}
        WHERE id=${id}`;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteOrder(id: string): Promise<void> {
    try {
        await sql`DELETE FROM orders WHERE id=${id}`;
    } catch (error) {
        console.log(error);
    }
}
