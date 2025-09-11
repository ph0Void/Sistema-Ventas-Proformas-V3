// src/schema/SaleSchema.ts

import { z } from "zod";
import {ClientSchema} from "@/schema/ClientSchema";
import {OrderDetailResponseSchema, OrderDetailSchema} from "@/schema/OrderDetailSchema";

/**
 * Schema para las ventas.
 */
export const SaleSchema = z.object({
  id: z.number().optional(),
  total: z.number(),
  createAt: z.string().nullable(),
  orderDetails: z.array(OrderDetailResponseSchema),
  client: ClientSchema, // Incluye los datos del cliente
  count_product: z.number(),
});

/**
 * Schema para la solicitud de venta.
 * para crear o actualizar una nueva venta.
 * Incluye los datos del cliente y los detalles del pedido.
 */
export const SaleRequestSchema = z.object({
  client: ClientSchema,
  orderDetails: z.array(OrderDetailSchema),
});

/**
 * Schema para validar la respuesta de la API al crear o actualizar o eliminar una venta.
 * Incluye los campos: success, message, data (que contiene la venta) y date.
 */
export const SaleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: SaleSchema.nullable(),
  date: z.string(),
});

/**
 * Schema para validar la respuesta de la API al obtener una lista de ventas.
 * PARA OBTENER LAS VENTAS DE UN VENDEDOR
 */
export const SaleListResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        content: z.array(SaleSchema),
        hasPrevious: z.boolean(),
        totalElements: z.number(),
        currentPage: z.number(),
        hasNext: z.boolean(),
    }),
    date: z.string(),
});

