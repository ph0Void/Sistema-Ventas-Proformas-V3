
import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import { SaleSchema, SaleRequestSchema, SaleResponseSchema, SaleListResponseSchema } from "@/schema/SaleSchema";
import { z } from "zod";

const API_URL = envConfig.API_URL;

export class SaleService {

    /**
     * Obtiene una venta por su ID y los datos del cliente asociado
     * @param id
     */
    static async getById(id: number) {
        const response = await fetchHelper<z.infer<typeof SaleResponseSchema>>(
            `${API_URL}/sale/${id}`,
            {
                method: "GET",
            }
        );

        return SaleResponseSchema.parse(response);
    }

    /**
     * Obtiene todas las ventas
     */
    static async getAll(page: number = 0, size: number = 5) {
        const response = await fetchHelper<z.infer<typeof SaleListResponseSchema>>(
            `${API_URL}/sale?page=${page}&size=${size}`,
            { method: "GET" }
        );

        if (response?.data && response.data.content === undefined) {
            response.data.content = [];
        }

        return SaleListResponseSchema.parse(response);
    }

    /**
     * Crea una nueva venta
     */
    static async create(saleData: z.infer<typeof SaleRequestSchema>) {
        const validatedData = SaleRequestSchema.parse(saleData);

        const response = await fetchHelper<z.infer<typeof SaleResponseSchema>>(
            `${API_URL}/sale`,
            {
                method: "POST",
                body: JSON.stringify(validatedData),
            }
        );

        return SaleResponseSchema.parse(response);
    }

    /**
     * Actualiza una venta
     */
    static async update(id: number, saleData: z.infer<typeof SaleRequestSchema>) {
        const validatedData = SaleRequestSchema.parse(saleData);

        const response = await fetchHelper<z.infer<typeof SaleResponseSchema>>(
            `${API_URL}/sale/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(validatedData),
            }
        );

        return SaleResponseSchema.parse(response);
    }

    /**
     * Elimina una venta
     */
    static async delete(id: number) {
        const response = await fetchHelper<z.infer<typeof SaleResponseSchema>>(
            `${API_URL}/sale/${id}`,
            {
                method: "DELETE",
            }
        );

        return SaleResponseSchema.parse(response);
    }
}
