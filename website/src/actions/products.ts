"use server"

import { CreateUpdateProduct, createUpdateProductSchema } from "@/types/products"
import { Product, productSchema } from "@/types/products"
import { sql } from "@vercel/postgres"
import { cache } from "react"

export async function getProducts(): Promise<Product[]>{
    console.log("getProducts")
    const result = await sql`SELECT * FROM products`;
    console.log(result)
    const products = await Promise.all(result.rows.map(async (product: any) => {
        product.price = parseFloat(product.price)
        const parsedProduct = await productSchema.safeParseAsync(product);
        console.log(parsedProduct)
        if (!parsedProduct.success) {
            console.log("Error parsing product: ", parsedProduct.error.message)
            return null
        } else {
            
            return parsedProduct.data
        }
    })
    )
    return  products.flatMap((product) => product ? [product] : []) as Product[]
}


export const getProductsCached = cache(async () => {
    console.log("getProducts")
    const result = await sql`SELECT * FROM products`;
    console.log(result)
    const products = await Promise.all(result.rows.map(async (product: any) => {
        product.price = parseFloat(product.price)
        const parsedProduct = await productSchema.safeParseAsync(product);
        console.log(parsedProduct)
        if (!parsedProduct.success) {
            console.log("Error parsing product: ", parsedProduct.error.message)
            return null
        } else {

            return parsedProduct.data
        }
    })
    )
    return products.flatMap((product) => product ? [product] : []) as Product[]
})

export async function getProduct(id: string): Promise<Product | undefined> {
    try {
        const product = await sql`SELECT * FROM products WHERE id = ${id}`
        product.rows[0].price = parseFloat(product.rows[0].price)
        const parsedpProduct = await productSchema.parseAsync(product.rows[0])
        return parsedpProduct
    } catch (error) {
        console.error(error)
        return
    }

}

export async function createProduct(product: CreateUpdateProduct): Promise<void> {
    try {
        const parsedProduct = await createUpdateProductSchema.safeParseAsync(product)
        if (!parsedProduct.success) {
            throw new Error(parsedProduct.error.message)
        }
        await sql`INSERT INTO products (name, description, price, image, quantity) 
        VALUES (${parsedProduct.data.name}, ${parsedProduct.data.description}, 
        ${parsedProduct.data.price}, ${parsedProduct.data.image}, ${parsedProduct.data.quantity})` 
    } catch (error) { 
        console.log(error)
    }
}

export async function updateProduct(id: string, product: CreateUpdateProduct): Promise<void>{
     try {
        const parsedProduct = await createUpdateProductSchema.safeParseAsync(product)
        if (!parsedProduct.success) {
            throw new Error(parsedProduct.error.message)
        }
        await sql`UPDATE products SET 
        name=${parsedProduct.data.name}, description=${parsedProduct.data.description}, 
        price=${parsedProduct.data.price}, image=${parsedProduct.data.image}, quantity=${parsedProduct.data.quantity} 
        WHERE id=${id}`
    } catch (error) { 
        console.log(error)
    }
}

export async function deleteProduct(id: string): Promise<void>{
    try {
        await sql`DELETE FROM products WHERE id=${id}`
    } catch (error) {
        console.log(error)
    }
}