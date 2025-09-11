// src/schema/MessageSchema.ts

import {z} from "zod";

export const MessageSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.record(z.string(), z.any()).optional(),
    date: z.string().optional(),
})