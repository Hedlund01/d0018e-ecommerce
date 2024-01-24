import { mapExpiresAt } from "@auth/pg-adapter"
import { Awaitable } from "next-auth"
import { Adapter, VerificationToken, AdapterUser, AdapterSession, AdapterAccount } from "next-auth/adapters"
import { Pool } from "pg"


export interface AdapterUserEcommerce extends AdapterUser {
    role: string
}

export interface CustomAdapter {
    createUser?: (user: Omit<AdapterUserEcommerce, "id">) => Awaitable<AdapterUserEcommerce>
    getUser?: (id: string) => Awaitable<AdapterUserEcommerce | null>
    getUserByEmail?: (email: string) => Awaitable<AdapterUserEcommerce | null>
    /** Using the provider id and the id of the user for a specific account, get the user. */
    getUserByAccount?: (
        providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) => Awaitable<AdapterUserEcommerce | null>
    updateUser?: (
        user: Partial<AdapterUserEcommerce> & Pick<AdapterUserEcommerce, "id">
    ) => Awaitable<AdapterUserEcommerce>
    /** @todo Implement */
    deleteUser?: (
        userId: string
    ) => Promise<void> | Awaitable<AdapterUserEcommerce | null | undefined>
    linkAccount?: (
        account: AdapterAccount
    ) => Promise<void> | Awaitable<AdapterAccount | null | undefined>
    /** @todo Implement */
    unlinkAccount?: (
        providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) => Promise<void> | Awaitable<AdapterAccount | undefined>
    /** Creates a session for the user and returns it. */
    createSession?: (session: {
        sessionToken: string
        userId: string
        expires: Date
    }) => Awaitable<AdapterSession>
    getSessionAndUser?: (
        sessionToken: string
    ) => Awaitable<{ session: AdapterSession; user: AdapterUserEcommerce } | null>
    updateSession?: (
        session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) => Awaitable<AdapterSession | null | undefined>
    /**
     * Deletes a session from the database.
     * It is preferred that this method also returns the session
     * that is being deleted for logging purposes.
     */
    deleteSession?: (
        sessionToken: string
    ) => Promise<void> | Awaitable<AdapterSession | null | undefined>
    createVerificationToken?: (
        verificationToken: VerificationToken
    ) => Awaitable<VerificationToken | null | undefined>
    /**
     * Return verification token from the database
     * and delete it so it cannot be used again.
     */
    useVerificationToken?: (params: {
        identifier: string
        token: string
    }) => Awaitable<VerificationToken | null>
}



export default function CustomPostgresAdapter(client: Pool): Adapter {
    return {
        async createVerificationToken(
            verificationToken: VerificationToken
        ): Promise<VerificationToken> {
            const { identifier, expires, token } = verificationToken
            const sql = `
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES ($1, $2, $3)
        `
            await client.query(sql, [identifier, expires, token])
            return verificationToken
        },
        async useVerificationToken({
            identifier,
            token,
        }: {
            identifier: string
            token: string
        }): Promise<VerificationToken> {
            const sql = `delete from verification_token
      where identifier = $1 and token = $2
      RETURNING identifier, expires, token `
            const result = await client.query(sql, [identifier, token])
            return result.rowCount !== 0 ? result.rows[0] : null
        },

        async createUser(user: Omit<AdapterUserEcommerce, "id">) {
            const { name, email, emailVerified, image, role } = user
            const sql = `
        INSERT INTO users (name, email, "emailVerified", image, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, "emailVerified", image, role`
            const result = await client.query(sql, [
                name,
                email,
                emailVerified,
                image,
                role,
            ])
            return result.rows[0]
        },
        async getUser(id) {
            const sql = `select * from users where id = $1`
            try {
                const result = await client.query(sql, [id])
                return result.rowCount === 0 ? null : result.rows[0]
            } catch (e) {
                return null
            }
        },
        async getUserByEmail(email) {
            const sql = `select * from users where email = $1`
            const result = await client.query(sql, [email])
            return result.rowCount !== 0 ? result.rows[0] : null
        },
        async getUserByAccount({
            providerAccountId,
            provider,
        }): Promise<AdapterUserEcommerce | null> {
            const sql = `
          select u.* from users u join accounts a on u.id = a."userId"
          where 
          a.provider = $1 
          and 
          a."providerAccountId" = $2`

            const result = await client.query(sql, [provider, providerAccountId])
            return result.rowCount !== 0 ? result.rows[0] : null
        },
        async updateUser(user: Partial<AdapterUserEcommerce>): Promise<AdapterUserEcommerce> {
            const fetchSql = `select * from users where id = $1`
            const query1 = await client.query(fetchSql, [user.id])
            const oldUser = query1.rows[0]

            const newUser = {
                ...oldUser,
                ...user,
            }

            const { id, name, email, emailVerified, image } = newUser
            const updateSql = `
        UPDATE users set
        name = $2, email = $3, "emailVerified" = $4, image = $5
        where id = $1
        RETURNING name, id, email, "emailVerified", image
      `
            const query2 = await client.query(updateSql, [
                id,
                name,
                email,
                emailVerified,
                image,
            ])
            return query2.rows[0]
        },
        async linkAccount(account) {
            const sql = `
      insert into accounts 
      (
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning
        id,
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `

            const params = [
                account.userId,
                account.provider,
                account.type,
                account.providerAccountId,
                account.access_token,
                account.expires_at,
                account.refresh_token,
                account.id_token,
                account.scope,
                account.session_state,
                account.token_type,
            ]

            const result = await client.query(sql, params)
            return mapExpiresAt(result.rows[0])
        },
        async createSession({ sessionToken, userId, expires }) {
            if (userId === undefined) {
                throw Error(`userId is undef in createSession`)
            }
            const sql = `insert into sessions ("userId", expires, "sessionToken")
      values ($1, $2, $3)
      RETURNING id, "sessionToken", "userId", expires`

            const result = await client.query(sql, [userId, expires, sessionToken])
            return result.rows[0]
        },

        async getSessionAndUser(sessionToken: string | undefined): Promise<{
            session: AdapterSession
            user: AdapterUserEcommerce
        } | null> {
            if (sessionToken === undefined) {
                return null
            }
            const result1 = await client.query(
                `select * from sessions where "sessionToken" = $1`,
                [sessionToken]
            )
            if (result1.rowCount === 0) {
                return null
            }
            let session: AdapterSession = result1.rows[0]

            const result2 = await client.query("select * from users where id = $1", [
                session.userId,
            ])
            if (result2.rowCount === 0) {
                return null
            }
            const user = result2.rows[0]
            return {
                session,
                user,
            }
        },
        async updateSession(
            session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
        ): Promise<AdapterSession | null | undefined> {
            const { sessionToken } = session
            const result1 = await client.query(
                `select * from sessions where "sessionToken" = $1`,
                [sessionToken]
            )
            if (result1.rowCount === 0) {
                return null
            }
            const originalSession: AdapterSession = result1.rows[0]

            const newSession: AdapterSession = {
                ...originalSession,
                ...session,
            }
            const sql = `
        UPDATE sessions set
        expires = $2
        where "sessionToken" = $1
        `
            const result = await client.query(sql, [
                newSession.sessionToken,
                newSession.expires,
            ])
            return result.rows[0]
        },
        async deleteSession(sessionToken) {
            const sql = `delete from sessions where "sessionToken" = $1`
            await client.query(sql, [sessionToken])
        },
        async unlinkAccount(partialAccount) {
            const { provider, providerAccountId } = partialAccount
            const sql = `delete from accounts where "providerAccountId" = $1 and provider = $2`
            await client.query(sql, [providerAccountId, provider])
        },
        async deleteUser(userId: string) {
            await client.query(`delete from users where id = $1`, [userId])
            await client.query(`delete from sessions where "userId" = $1`, [userId])
            await client.query(`delete from accounts where "userId" = $1`, [userId])
        },
    }
}
