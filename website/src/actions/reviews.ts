"use server"

import { OrderLine, orderLineSchema } from "@/types/order_line";
import { Product } from "@/types/products";
import { auth } from "@/utils/auth";
import { sql } from "@vercel/postgres";

export async function currentUserCanRateProduct(productId: Number): Promise<boolean> {
    const authResult = await auth();
    if (!authResult) {
        console.log(currentUserCanRateProduct.name, "Authentication failed");
        return false;
    }

    const orderLines = await getCurrentUserBoughtProducts();
    console.log(currentUserCanRateProduct.name, orderLines)
    console.log(currentUserCanRateProduct.name, orderLines.filter(o => o.productId === productId).length)
    if (orderLines.filter(o => o.productId === productId).length <= 0) {
        return false
    }
    return true;
}


export async function getCurrentUserBoughtProducts(): Promise<OrderLine[]>{
    const authResult = await auth();
    if (!authResult) {
        console.log(currentUserCanRateProduct.name, "Authentication failed");
        return [];
    }
    try {
        console.log(getCurrentUserBoughtProducts.name, "Getting current user bought products")
        const userOrders = await sql`SELECT id FROM orders WHERE userid=${authResult.user.id}`
        const orderIds: number[] = userOrders.rows.map(o => o.id)
        console.log(getCurrentUserBoughtProducts.name, "orderIds", orderIds)
        const r = await sql`SELECT * FROM order_lines WHERE orderid = ANY(${orderIds as any})`
        console.log(getCurrentUserBoughtProducts.name, r.rows)
        const parsedProducts = await orderLineSchema.array().parseAsync(r.rows);

        console.log(getCurrentUserBoughtProducts.name, parsedProducts)
    

        return parsedProducts
        
    } catch (error) {
        console.log(getCurrentUserBoughtProducts.name, error)
        return []
    }


   
}


export async function reviewProductForCurrentUser(productId: Number, reviewText: string, rating: number): Promise<{
    success: boolean,
    error?: string
}> {
    const authResult = await auth();
    if (!authResult) {
        console.log(reviewProductForCurrentUser.name, "Authentication failed");
        return {
            success: false,
            error: "Authentication failed."
        }
    }
    if (!currentUserCanRateProduct(productId)) {
        return {
            success: false,
            error: "Can not review a product that hasn't been bought."
        }
    }
    
    try {
        await sql`INSERT INTO reviews (userid, productid, review_text, rating) VALUES (${authResult.user.id}, ${productId.toString()}, ${reviewText}, ${rating})`
        
    } catch (error) {
        console.log(reviewProductForCurrentUser.name, error)
        return {
            success: false,
            error: "An error occured."
        }
        
    }

    return {
        success: true
    }
}