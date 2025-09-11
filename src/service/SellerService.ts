import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import { SellerSchema, SellerResponseSchema } from "@/schema/SellerSchema";
import { z } from "zod";

const API_URL = envConfig.API_URL;

export class SellerService {

    /**
     * Obtiene el vendedor asociado al usuario autenticado
     * Si no existe, retorna null
     */
    static async getSeller(){
        try {
            const response = await fetchHelper<z.infer<typeof SellerResponseSchema>>(
                `${API_URL}/seller/by-user`,
                {
                    method: "GET",
                }
            )
            return SellerResponseSchema.parse(response);
        } catch (error) {
            // Si no encuentra vendedor, retorna null en lugar de lanzar error
            return { success: false, message: "", data: null, date: new Date().toISOString() };
        }
    }

    /**
     * Crea un nuevo vendedor
     */
    static async create(sellerData: z.infer<typeof SellerSchema>) {
        const validatedData = SellerSchema.parse(sellerData);

        const response = await fetchHelper<z.infer<typeof SellerResponseSchema>>(
            `${API_URL}/seller`,
            {
                method: "POST",
                body: JSON.stringify(validatedData),
            }
        );

        return SellerResponseSchema.parse(response);
    }

    /**
     * Actualiza un vendedor
     */
    static async update(sellerData: z.infer<typeof SellerSchema>) {
        const validatedData = SellerSchema.parse(sellerData);

        const response = await fetchHelper<z.infer<typeof SellerResponseSchema>>(
            `${API_URL}/seller`,
            {
                method: "PUT",
                body: JSON.stringify(validatedData),
            }
        );

        return SellerResponseSchema.parse(response);
    }
}