"use server"

import { Product, productSchema } from "@/types/products";
import { sql } from "@vercel/postgres";

export async function categoryRecommendations(category: string): Promise<Product[]> {

    const r = await sql`SELECT * FROM products WHERE category=${category} ORDER BY RANDOM() LIMIT 3`;
    
    const parsedProducts = await productSchema.array().safeParseAsync(r.rows)
    if (!parsedProducts.success) {
        console.error(categoryRecommendations.name, parsedProducts.error);
        return [];
    }
    return parsedProducts.data;

}