"use server"

import { auth } from "@/utils/auth";
import { createClient } from "@vercel/postgres";



export async function checkout(userId: string = ""): Promise<{
    success: boolean
    message: string
    id?: number
}> {
    const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return {
            success: false,
            message: "Authentication failed"
        
        };
    }
    if (userId !== "" && authResult.user.role !== "admin") { 
        console.log(`${authResult.user.email} is not an admin and cannot checkout for other users!`);
        return {
            success: false,
            message: `${authResult.user.email} is not an admin and cannot checkout for other users!`
        
        };
    }
    if (userId === "") userId = authResult.user.id as string;

    let orderId = null;
    const client = createClient()
    client.connect()
    try {
        //start transaction
        await client.query('BEGIN;')

        // get cart lines
        const cartLinesRes = await client.query(`SELECT * FROM cart_lines WHERE userId = ${userId}`);
        // no cart lines, nothing to checkout
        if (cartLinesRes.rows.length === 0) throw new Error("No cart lines to checkout");

        // create order
        const orderRes = await client.query(`INSERT INTO Orders (userId, status, totalPrice, totalQuantity)  VALUES(${userId}, 'creating_order', 0, 0) RETURNING id`);

        orderId = orderRes.rows[0].id;


        let totalPrice = 0;
        let totalQuantity = 0;

        // create order lines
        for (const cartLine of cartLinesRes.rows) {
            const productRes = await client.query(`SELECT * FROM products WHERE id = ${cartLine.productid}`);
            // product not found
            if (productRes.rows.length === 0) {
                throw new Error(`Product ${cartLine.productId} not found`);
            }
            const product = productRes.rows[0];
            // not enough quantity, setting to max available
            if (product.quantity < cartLine.quantity) {
                console.log(`Not enough quantity for product ${product.id}, ordered ${cartLine.quantity}, available ${product.quantity}, setting to max available`);
                cartLine.quantity = product.quantity;
            }

            totalPrice += product.price * cartLine.quantity;
            totalQuantity += cartLine.quantity;

            // create order line
            await client.query(`INSERT INTO order_lines (orderId, productId, quantity, price, status) VALUES(${orderId}, ${product.id}, ${cartLine.quantity}, ${product.price}, 'created_order_line')`);

            // update product quantity
            await client.query(`UPDATE products SET quantity = ${product.quantity - cartLine.quantity} WHERE id = ${product.id}`);

        }

        // update order
        await client.query(`UPDATE Orders SET totalPrice = ${totalPrice}, totalQuantity = ${totalQuantity}, status = 'created_order' WHERE id = ${orderId}`);

        // delete cart lines
        await client.query(`DELETE FROM cart_lines WHERE userId = ${authResult.user.id}`);

        //end transaction
        await client.query(`COMMIT`)
    }
    catch (error: any) {
        await client.query('ROLLBACK')
        console.error(error)
        return {
            success: false,
            message: error.message
        }
    }
    finally {
        await client.end()
    }

    return {
        success: true,
        message: "Order created",
        id: orderId
    }
}