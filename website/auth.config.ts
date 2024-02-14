import Authentik from "@auth/core/providers/authentik";
import type { NextAuthConfig } from "next-auth";
import { type Session, type User } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: string,
            id: string | undefined
        } & User
    }

    interface User {
        role: string
    }
}

export default {
    debug: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    providers: [
        GitHub,
        Authentik({ clientId: process.env.AUTHENTIK_ID, clientSecret: process.env.AUTHENTIK_SECRET, issuer: process.env.AUTHENTIK_ISSUER})
    ].filter(Boolean) as NextAuthConfig["providers"],
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user }: { session: Session; user?: User }) {
            session.user.role = user?.role ?? "user";
            session.user.id = user?.id
            return session;
        }
    }

} satisfies NextAuthConfig