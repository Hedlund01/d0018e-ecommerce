import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import NextAuth, { type Session, type User } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            role: string
        } & User
    }

    interface User {
        role: string
    }
}

export default {
    debug: false,
    providers: [
        GitHub,
    ].filter(Boolean) as NextAuthConfig["providers"],
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user }: { session: Session; user?: User }) {
            session.user.role = user?.role ?? "user";
            return session;
        }
    }

} satisfies NextAuthConfig