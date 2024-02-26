"use server"

import { OrderLine, orderLineSchema } from "@/types/order_line";
import { GetReviewDTO, getReviewDTOSchema } from "@/types/review";
import { auth } from "@/utils/auth";
import { sql } from "@vercel/postgres";

export async function currentUserCanRateProduct(productId: Number): Promise<boolean> {
    const authResult = await auth();
    if (!authResult) {
        console.log(currentUserCanRateProduct.name, "Authentication failed");
        return false;
    }

    const orderLines = await getCurrentUserBoughtProducts();
    if (orderLines.filter(o => o.productid === productId).length <= 0) {
        return false
    }
    return true;
}


export async function getCurrentUserBoughtProducts(): Promise<OrderLine[]> {
    const authResult = await auth();
    if (!authResult) {
        console.log(currentUserCanRateProduct.name, "Authentication failed");
        return [];
    }
    try {
        const userOrders = await sql`SELECT id FROM orders WHERE userid=${authResult.user.id}`
        const orderIds: number[] = userOrders.rows.map(o => o.id)
        const r = await sql`SELECT * FROM order_lines WHERE orderid = ANY(${orderIds as any})`
        const parsedProducts = await orderLineSchema.array().parseAsync(r.rows);
        return parsedProducts

    } catch (error) {
        console.log(getCurrentUserBoughtProducts.name, "error",error)
        return []
    }



}

export async function getPreviousProductReviews(productId: number, limit: number = 10, offset: number = 0): Promise<GetReviewDTO[]> {
    if (offset < 0) {
        offset = 0
    }
    if (limit < 0) {
        limit = 0
    }
    if (limit > 100) {
        limit = 100
    }
    try {
        const r = await sql`SELECT review_lines.created_at, review_lines.review_text, review_lines.rating, users.name, users.image FROM review_lines INNER JOIN users ON review_lines.userid = users.id WHERE productid=${productId.toString()} ORDER BY review_lines.created_at DESC LIMIT ${limit} OFFSET ${offset}`

        const parsedReviews = await getReviewDTOSchema.array().parseAsync(r.rows);
        return parsedReviews

    } catch (error) {
        console.log(getPreviousProductReviews.name, "error", error)
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
        const exsits = await sql`SELECT * FROM review_lines WHERE userid=${authResult.user.id} AND productid=${productId.toString()}`
        if (exsits.rows.length > 0) {
            return {
                success: false,
                error: "You have already reviewed this product."
            }
        }
        
        await sql`INSERT INTO review_lines (userid, productid, review_text, rating, created_at) VALUES (${authResult.user.id}, ${productId.toString()}, ${reviewText}, ${rating}, NOW())`

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