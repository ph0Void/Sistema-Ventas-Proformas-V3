// src/schema/OrderDetailSchema.ts
import {ProductSchema} from "@/schema/ProductSchema";
import {z} from "zod";

/**
 * Schema para crear o actualizar los detalles de una orden.
 * Incluye los campos: productId y quantity.
 * Utilizado en SALES O PROFORMA
 */
export const OrderDetailSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
});

/**
 * Schema para los detalles del carrito de compras.
 * Incluye los campos: quantity y product (que contiene el producto asociado).
 * Utilizado en el carrito de compras.
 */
export const CartOrderDetailSchema = z.object({
    quantity: z.number(),
    product: ProductSchema,
})


/**
 * Schema para validar la respuesta de la API al obtener los detalles de una orden.
 * Incluye los campos: id, quantity y product (que contiene el producto asociado).
 * Utilizado en SALES O PROFORMA
 */
export const OrderDetailResponseSchema = z.object({
    id: z.number().optional(),
    quantity: z.number(),
    product: ProductSchema,
});