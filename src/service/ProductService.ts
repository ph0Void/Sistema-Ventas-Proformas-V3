import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import {
    ProductResponseSchema,
    ProductListResponseSchema,
    ProductRequestSchema
} from "@/schema/ProductSchema";
import { z } from "zod";

const API_URL = envConfig.API_URL;

export class ProductService {

    /**
     * Obtiene un producto por su ID
     * @param id
     */
    static async getById(id: number) {
        const response = await fetchHelper<z.infer<typeof ProductResponseSchema>>(
            `${API_URL}/product/${id}`,
            {
                method: "GET",
            }
        );
        //console.log(response);
        return ProductResponseSchema.parse(response);
    }

    /**
     * Obtiene todos los productos con paginación
     * @param page página actual
     * @param size tamaño de página
     */
    static async getAll(page: number = 0, size: number = 5) {
        const response = await fetchHelper<z.infer<typeof ProductListResponseSchema>>(
            `${API_URL}/product?page=${page}&size=${size}`
        );

        return ProductListResponseSchema.parse(response);
    }

    /**
     * Crea un nuevo producto
     */
    static async create(productData: z.infer<typeof ProductRequestSchema>) {
        const validatedData = ProductRequestSchema.parse(productData);

        const response = await fetchHelper<z.infer<typeof ProductResponseSchema>>(
            `${API_URL}/product`,
            {
                method: "POST",
                body: JSON.stringify(validatedData),
            }
        );

        return ProductResponseSchema.parse(response);
    }

    /**
     * Actualiza un producto
     */
    static async update(id: number, productData: z.infer<typeof ProductRequestSchema>) {
        const validatedData = ProductRequestSchema.parse(productData);

        const response = await fetchHelper<z.infer<typeof ProductResponseSchema>>(
            `${API_URL}/product/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(validatedData),
            }
        );

        return ProductResponseSchema.parse(response);
    }

    /**
     * Elimina un producto
     */
    static async delete(id: number) {
        const response = await fetchHelper<z.infer<typeof ProductResponseSchema>>(
            `${API_URL}/product/${id}`,
            {
                method: "DELETE",
            }
        );

        return ProductResponseSchema.parse(response);
    }
}
