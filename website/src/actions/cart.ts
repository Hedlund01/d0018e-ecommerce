"use server"
import { CartLine, cartLineSchema } from "@/types/products";
import { auth } from "@/utils/auth";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";

export async function setCartDB(cartLines: CartLine[]) {
    const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return;
    }
    console.log(setCartDB.name, cartLines)
    const parsedCart = await cartLineSchema.array().safeParseAsync(cartLines);
    if (!parsedCart.success) {
        console.log("Invalid cart products", parsedCart.error.message);
        return;
    }
    try {
        for (const line of cartLines) {
            await sql`	
	                    INSERT INTO cart_lines (userId, productId, quantity) VALUES(${authResult.user.id}, ${line.product.id}, ${line.quantity}) 
	                    ON CONFLICT (userId, productId) DO UPDATE
	                    SET quantity=cart_lines.quantity+1;

                    `;
        }
    } catch (error) {
        console.log("Error setting cart in database", error);
    }
}

export async function setQuantityDB(productId: number, quantity: number) {
     const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return;
    }
    try {
        await sql`
            UPDATE cart_lines SET quantity = ${quantity} WHERE userId = ${authResult.user.id} AND productId = ${productId}
        `;
    } catch (error) {
        console.log("Error setting quantity in database", error);
    }
}

export async function getCartDB(): Promise<CartLine[]> {
    const authResult = await auth();
    if (authResult === null || authResult.user.id === undefined) {
        console.log("Authentication failed");
        return [];
    }
    try {
        const result = await sql`SELECT cart_lines.userId, cart_lines.productId, products.name, products.image, products.price, products.category, cart_lines.quantity FROM Cart_lines INNER JOIN products ON products.id = cart_lines.productId  WHERE cart_lines.userId = ${Number(authResult.user.id)}`;
        const cartProducts = result.rows.map((row: any) => {
            return {
                userId: row.userid,
                product: {
                    id: row.productid,
                    name: row.name,
                    image: row.image,
                    price: Number(row.price),
                    category: row.category
                },
                quantity: row.quantity,
            }
        });
        const parsedcart = await cartLineSchema.array().safeParseAsync(cartProducts);
        if (parsedcart.success) {
            return parsedcart.data;
        } else {
            console.log(getCartDB.name, "Invalid cart products", parsedcart.error.message);
            return [];
        }

    } catch (error) {
        return []
    }
}


export async function removeCartDB(productId: number) {
      const authResult = await auth();
    if (!authResult) {
        console.log("Authentication failed");
        return;
    }
    try {
        await sql`DELETE FROM cart_lines WHERE userId = ${authResult.user.id} AND productId = ${productId}`;
    } catch (error) {
        console.log("Error removing cart from database");
    }
}

export async function setCartCookie(cartLines: CartLine[]) {
    const parsedCart = await cartLineSchema.array().safeParseAsync(cartLines);
    if (!parsedCart.success) {
        console.log(setCartCookie.name, "Invalid cart products", parsedCart.error.message);
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
            console.log(getCartCookie.name, "Invalid cart cookie", parsedCart.error.message);
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