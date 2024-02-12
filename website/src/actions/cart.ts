"use server"
import { CartLine, cartLineSchema } from "@/types/products";
import { auth } from "@/utils/auth";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";

export async function setCartDB(cartLines: CartLine[]) {
    console.log("Setting cart in database");
    const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return;
    }
    const parsedCart = await cartLineSchema.array().safeParseAsync(cartLines);
    if (!parsedCart.success) {
        console.log("Invalid cart products", parsedCart.error.message);
        return;
    }
    try {
        for (const line of cartLines) {
            await sql`	
	                    INSERT INTO cart_lines (userId, productId, quantity) VALUES(1, 1, 1) 
	                    ON CONFLICT (userId, productId) DO UPDATE
	                    SET quantity=cart_lines.quantity+1;

                    `;
        }
    } catch (error) {
        console.log("Error setting cart in database", error);
    }
}

export async function setQuantityDB(userId: number, productId: number, quantity: number) {
    try {
        await sql`
            UPDATE cart_lines SET quantity = ${quantity} WHERE userId = ${userId} AND productId = ${productId}
        `;
    } catch (error) {
        console.log("Error setting quantity in database", error);
    }
}

export async function getCartDB(): Promise<CartLine[]> {
    console.log("Getting cart from database");
    const authResult = await auth();
    if (authResult === null || authResult.user.id === undefined) {
        console.log("Authentication failed");
        return [];
    }
    try {
        const result = await sql`SELECT cart_lines.userId, cart_lines.productId, products.name, products.image, products.price, cart_lines.quantity FROM Cart_lines INNER JOIN products ON products.id = cart_lines.productId  WHERE cart_lines.userId = ${Number(authResult.user.id)}`;
        console.log(result.rows);
        const cartProducts = result.rows.map((row: any) => {
            return {
                userId: row.userid,
                product: {
                    id: row.productid,
                    name: row.name,
                    image: row.image,
                    price: Number(row.price),
                },
                quantity: row.quantity,
            }
        });
        const parsedcart = await cartLineSchema.array().safeParseAsync(cartProducts);
        if (parsedcart.success) {
            return parsedcart.data;
        } else {
            console.log("Invalid cart products", parsedcart.error.message);
            return [];
        }

    } catch (error) {
        return []
    }
}


export async function removeCartDB(userId: number, productId: number) {
    try {
        await sql`DELETE FROM cart_lines WHERE userId = ${userId} AND productId = ${productId}`;
    } catch (error) {
        console.log("Error removing cart from database");
    }
}

export async function setCartCookie(cartLines: CartLine[]) {
    const parsedCart = await cartLineSchema.array().safeParseAsync(cartLines);
    if (!parsedCart.success) {
        console.log("Invalid cart products", parsedCart.error.message);
        return;
    }
    const cartString = JSON.stringify(parsedCart.data);
    cookies().set("cart", cartString, { sameSite: "strict", secure: process.env.NODE_ENV === "production" });

}

// SELECT * FROM cart WHERE id = ${userId}
export async function getCartCookie() {
    const cookie = cookies().get("cart");
    if (cookie) {
        const cartString = JSON.parse(cookie.value);
        const parsedCart = await cartLineSchema.array().safeParseAsync(cartString);
        if (parsedCart.success) {
            return parsedCart.data;
        } else {
            console.log("Invalid cart cookie", parsedCart.error.message);
            return [];
        }

    }
    return [];
}

export async function clearCartDB() {
    const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return;
    }
    try {
        await sql`DELETE FROM cart_lines WHERE userId = ${authResult.user.id}`;
    } catch (error) {

    }
}

export async function clearCartCookie() {
    cookies().delete("cart");
}