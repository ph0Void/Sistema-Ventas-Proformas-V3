"use server";

import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import {CategorySchema, CategoryResponseSchema, CategoryRequestSchema,} from "@/schema/CategorySchema";
import { MessageSchema } from "@/schema/MessageSchema";
import { z } from "zod";

const API_URL = envConfig.API_URL;

export class CategoryService {
    /**
     * Obtiene todas las categorías
     */
    static async getAll() {
        const response = await fetchHelper<z.infer<typeof CategoryResponseSchema>>(
            `${API_URL}/category`
        );

        return CategoryResponseSchema.parse(response);
    }

    /**
     * Crea una nueva categoría
     */
    static async create(categoryData: z.infer<typeof CategoryRequestSchema> ) {
        const response = await fetchHelper<z.infer<typeof CategoryResponseSchema > >(
            `${API_URL}/category`,
            {
                method: "POST",
                body: JSON.stringify(categoryData),
            }
        );

        return CategoryResponseSchema.parse(response);
    }

    /**
     * Actualiza una categoría
     */
    static async update(id: number, categoryData: z.infer<typeof CategoryRequestSchema> ) {
        const response = await fetchHelper<z.infer<typeof CategoryResponseSchema > >(
            `${API_URL}/category/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(categoryData),
            }
        );

        return CategoryResponseSchema.parse(response);
    }

    /**
     * Elimina una categoría
     */
    static async delete(id: number) {
        const response = await fetchHelper<z.infer<typeof MessageSchema>>(
            `${API_URL}/category/${id}`,
            {
                method: "DELETE",
            }
        );

        return MessageSchema.parse(response);
    }
}