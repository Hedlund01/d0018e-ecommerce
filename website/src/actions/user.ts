"use server"
import { User, UserRole, userRoleEnum, userSchema } from "@/types/user"
import { sql } from "@vercel/postgres"
import { z } from "zod"

export async function getUsers() {
    return await sql`SELECT * FROM users`
}

export async function getUser(id: number): Promise<User | null> {
    try {
        const user = await sql`SELECT * FROM users WHERE id = ${id}`
        const parsedUser = await userSchema.parseAsync(user.rows[0])
        return parsedUser
    } catch (error) {
        console.error(error)
        return null
    }

}

export async function updateUserRole(id: number, role: UserRole) {
    try {
        if (!(await userRoleEnum.safeParseAsync(role)).success) throw new Error("Invalid role")
        if (!(await z.number().safeParseAsync(id)).success) throw new Error("Invalid id");
        sql`UPDATE users SET role = ${role} WHERE id = ${id}`
    } catch (error) {
        console.error(error)
    }
}