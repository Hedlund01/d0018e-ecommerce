import { z } from 'zod';

export const userRoleEnum = z.enum(['user', 'admin'])
export type UserRole = z.infer<typeof userRoleEnum>;



export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.date().nullish(),
    image: z.string().url().nullish(),
    role: userRoleEnum.default(userRoleEnum.Values.user),
});
export type User = z.infer<typeof userSchema>;