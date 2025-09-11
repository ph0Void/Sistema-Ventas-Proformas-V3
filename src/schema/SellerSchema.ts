// src/schema/SellerSchema.ts
import {z} from "zod";

/**
 * Schema para validar los datos de un vendedor.
 * para la creación y actualización de vendedores.
 * Incluye los campos: nombre, apellido, carnet y dirección de la tienda.
 */
export const SellerSchema = z.object({
    name: z.string()
        .min(1, {message: "El nombre es obligatorio"}),
    lastName: z.string()
        .min(1, {message: "El apellido es obligatorio"}),
    carnet: z.number()
        .int({message: "El carnet debe ser un número entero"})
        .min(10000000, {message: "El carnet debe tener exactamente 8 dígitos"})
        .max(99999999, {message: "El carnet debe tener exactamente 8 dígitos"}),
    storeAddress: z.string()
        .min(1, {message: "La dirección de la tienda es obligatoria"}),
});

/**
 * Schema para validar la respuesta de la API al crear o actualizar un vendedor.
 * Incluye los campos: success, message, data (que contiene el vendedor) y date.
 */
export const SellerResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: SellerSchema,
    date: z.string(),
});

