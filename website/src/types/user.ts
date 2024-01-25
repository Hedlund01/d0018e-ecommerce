import { z } from 'zod';

export const userRoleEnum = z.enum(['user', 'admin']).optional().default("user");
export type UserRole = z.infer<typeof userRoleEnum>;

export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.date().nullable(),
    image: z.string().url().optional(),
    role: userRoleEnum,
});
export type User = z.infer<typeof userSchema>;