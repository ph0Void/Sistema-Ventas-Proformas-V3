// src/schema/ProductSchema.ts
import { z } from "zod";
import {CategoryRequestSchema, CategorySchema} from "./CategorySchema";

/**
 * Schema de los productos
 * para creación y actualización
 */
export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string()
      .min(1,{message: "El nombre es obligatorio"} )
      .max(100,  { message: "El nombre es demaciado largo"}),
  urlImage: z.string(),
  description: z.string(),
  price: z.number()
      .min(0, { message: "El precio no puede ser negativo" }),
  stock: z.number(),
  category: CategorySchema,
});

/**
 * Schema para la creación de un producto
 */
export const ProductRequestSchema = z.object({
    name: z.string()
        .min(1,{message: "El nombre es obligatorio"} )
        .max(100,  { message: "El nombre es demaciado largo"}),
    urlImage: z.string()
        .url({ message: "La URL de la imagen no es válida" }),
    description: z.string()
        .min(1, { message: "La descripción es obligatoria" })
        .max(500, { message: "La descripción es demaciado larga" }),
    price: z.number()
        .positive({message: "El precio debe ser positivo"}),
    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, { message: "El stock no puede ser negativo" }),
    category: CategoryRequestSchema,
});

/**
 * Schema de la respuesta de un producto
 */
export const ProductResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ProductSchema.nullable(),
  date: z.string(),
});

/**
 * Schema de la respuesta de una lista de productos
 * con paginación
 */
export const ProductListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    totalElements: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    content: z.array(ProductSchema),
    currentPage: z.number(),
    size: z.number(),
    hasPrevious: z.boolean(),
  }),
  date: z.string(),
});

/**
 * Schema de la respuesta de todos los productos
 * sin paginación para las órdenes
 */
export const ProductAllResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(ProductSchema),
    date: z.string(),
});
