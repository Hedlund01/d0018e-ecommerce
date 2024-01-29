import NextAuth from "next-auth"
import type { Adapter } from "@auth/core/adapters"
// import Email from "next-auth/providers/email"
import authConfig from "@/../auth.config"
import PostgresAdapter from "@auth/pg-adapter"
import GitHub from "next-auth/providers/github"
import { NextAuthConfig } from "next-auth"
import { Pool } from "pg"
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export const config = {
    adapter: PostgresAdapter(pool) as Adapter,

    ...authConfig
} satisfies NextAuthConfig



export const { handlers, auth, signIn, signOut } = NextAuth(config)