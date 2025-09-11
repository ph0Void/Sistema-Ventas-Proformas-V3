// src/schema/ClientSchema.ts

import { z } from "zod";

/**
 * Schema del cliente utilizado en las ventas u proformas
 *
 */
export const ClientSchema = z.object({
    fullName: z.string()
        .min(1, {message: "El nombre completo es obligatorio"}),
    dni: z.number()
        .int({message: "El dni debe ser un número entero"})
        .min(10000000, {message: "El dni debe tener exactamente 8 dígitos"})
        .max(99999999, {message: "El dni debe tener exactamente 8 dígitos"}),
    phone: z.number()
        .int({message: "El teléfono debe ser un número entero"})
        .min(100000000, {message: "El teléfono debe tener al menos 9 dígitos"})
        .max(999999999, {message: "El teléfono debe tener como máximo 9 dígitos"}),
    email: z.string()
        .min(1, {message: "El email es obligatorio"})
        .email({message: "El email no es válido"}),
});
