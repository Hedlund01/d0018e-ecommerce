"use server"
import { sql } from "@vercel/postgres"
export async function getUsers() {
    return await sql`SELECT * FROM users`
}