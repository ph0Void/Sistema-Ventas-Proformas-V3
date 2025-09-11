// src/schema/ImageSchema.ts
import { z } from "zod";

/**
 * Schema para la respuesta de la subida de una imagen.
 */
export const ImageUploadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    url: z.string(),
  }),
  date: z.string(),
});


