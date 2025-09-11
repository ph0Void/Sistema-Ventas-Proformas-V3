import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import {ProformaRequestSchema, ProformaResponseSchema, ProformaListResponseSchema } from "@/schema/ProformaSchema";
import { z } from "zod";

const API_URL = envConfig.API_URL;

export class ProformaService {
    /**
     * Obtiene una proforma por su ID y los datos del cliente asociado
     * @param id
     */
    static async getById(id: number) {
        const response = await fetchHelper<z.infer<typeof ProformaRequestSchema>>(
            `${API_URL}/proforma/${id}`,
            {
                method: "GET",
            }
        );

        return ProformaResponseSchema.parse(response);
    }

    /**
     * Obtiene todas las proformas
     */
    static async getAll(page: number = 0, size: number = 5) {
        const response = await fetchHelper<z.infer<typeof ProformaListResponseSchema>>(
            `${API_URL}/proforma?page=${page}&size=${size}`,
            {
                method: "GET",
            }
        );

        if (response?.data && response.data.content === undefined) {
            response.data.content = [];
        }

        return ProformaListResponseSchema.parse(response);
    }

    /**
     * Crea una nueva proforma
     */
    static async create(proformaData: z.infer<typeof ProformaRequestSchema>) {
        const validatedData = ProformaRequestSchema.parse(proformaData);

        const response = await fetchHelper<z.infer<typeof ProformaResponseSchema>>(
            `${API_URL}/proforma`,
            {
                method: "POST",
                body: JSON.stringify(validatedData),
            }
        );

        return ProformaResponseSchema.parse(response);
    }

    /**
     * Actualiza una proforma
     */
    static async update(id: number, proformaData: z.infer<typeof ProformaRequestSchema>) {
        const validatedData = ProformaRequestSchema.parse(proformaData);

        const response = await fetchHelper<z.infer<typeof ProformaResponseSchema>>(
            `${API_URL}/proforma/${id}`,
            {
                method: "PUT",
                body: JSON.stringify(validatedData),
            }
        );

        return ProformaResponseSchema.parse(response);
    }

    /**
     * Elimina una proforma
     */
    static async delete(id: number) {
        const response = await fetchHelper<z.infer<typeof ProformaResponseSchema>>(
            `${API_URL}/proforma/${id}`,
            {
                method: "DELETE",
            }
        );

        return ProformaResponseSchema.parse(response);
    }
}
