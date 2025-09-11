import {z} from "zod";
import {OrderDetailResponseSchema} from "@/schema/OrderDetailSchema";
import {ClientSchema} from "@/schema/ClientSchema";

/**
 * Schema para las facturas.
 */
export const InvoiceSchema = z.object({
    id: z.number().optional(),
    total: z.number(),
    createAt: z.string().nullable(),
    orderDetails: z.array(OrderDetailResponseSchema),
    client: ClientSchema,
    count_product: z.number(),
})

export const InvoiceTableSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        totalPages: z.number(),
        content: z.array(InvoiceSchema),
        hasPrevious: z.boolean(),
        totalElements: z.number(),
        currentPage: z.number(),
        hasNext: z.boolean(),
    }),
    date: z.string(),
})
