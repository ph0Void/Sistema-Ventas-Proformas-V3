// src/schema/CategorySchema.ts
import { z } from "zod";

/**
 * Categoria Schema
 * para crear y actualizar categorias
 */
export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string()
      .min(1, {message: "El nombre es obligatorio"})
      .max(255, {message: "El nombre demasiado largo"}) ,
  products: z.array(z.any()).nullable(),
});

/**
 * Request de la API para crear o actualizar una categoria
 */
export const CategoryRequestSchema = CategorySchema.pick({
    name: true
});

/**
 * Respuesta de la API para una categoria
 */
export const CategoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(CategorySchema).nullable(),
  date: z.string(),
});

