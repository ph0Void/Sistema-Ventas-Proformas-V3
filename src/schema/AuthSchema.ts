// src/shcema/UserSchema.ts
import { z } from 'zod';

/**
 * Schema para el registro de un usuario.
 */
export const RegisterSchema = z.object({
    username: z.string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede tener más de 100 caracteres" }),

    password: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" }),

    confirmPassword: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" })

}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

/**
 * Schema para el login de un usuario.
 */
export const LoginSchema = z.object({
    username: z.string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede tener más de 100 caracteres" }),

    password: z.string()
        .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
        .max(100, { message: "La contraseña no puede tener más de 100 caracteres" }),
});

/**
 * Schema para la respuesta de autenticación (registro/login).
 */
export const AuthResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        token: z.string(),
    }),
    date: z.string(),
});
