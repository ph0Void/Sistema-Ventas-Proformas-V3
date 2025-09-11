// src/schema/ProformaSchema.ts
import { z } from "zod";
import {ClientSchema} from "@/schema/ClientSchema";
import {OrderDetailResponseSchema, OrderDetailSchema} from "@/schema/OrderDetailSchema";

/**
 * Schema para las proformas.
 */
export const ProformaSchema = z.object({
    id: z.number().optional(),
    total: z.number(),
    createAt: z.string().nullable(),
    orderDetails: z.array(OrderDetailResponseSchema),
    client: ClientSchema,
    count_product: z.number(),
});

/**
 * Schema para la solicitud de proforma.
 * para crear o actualizar una nueva proforma.
 * Incluye los datos del cliente y los detalles del pedido.
 */
export const ProformaRequestSchema = z.object({
    client: ClientSchema,
    orderDetails: z.array(OrderDetailSchema),
});

/**
 * Schema para validar la respuesta de la API al crear o actualizar o eliminar una proforma.
 * Incluye los campos: success, message, data (que contiene la proforma) y date.
 */
export const ProformaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ProformaSchema.nullable(),
  date: z.string(),
});

/**
 * Schema para validar la respuesta de la API al obtener una lista de proformas.
 * PARA OBTENER LAS PROFORMAS DE UN VENDEDOR
 * Incluye los campos: success, message, data (que contiene un array de proformas) y date.
 */
export const ProformaListResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        content: z.array(ProformaSchema),
        hasPrevious: z.boolean(),
        totalElements: z.number(),
        currentPage: z.number(),
        hasNext: z.boolean(),
    }),
    date: z.string(),
});