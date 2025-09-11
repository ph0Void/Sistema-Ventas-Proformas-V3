import {z} from "zod";
import {fetchHelper} from "@/service/helper/FetchHelper";
import {envConfig} from "@/config/EnvConfig";


const validTokenSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        tokenValid: z.boolean()
    })
})

const API_URL = envConfig.API_URL;

export async function ValidateTokenForUser() {
    try {
        const response = await fetchHelper<z.infer<typeof validTokenSchema>>(
            `${API_URL}/validate-token`,
            {
                method: "POST",
            }
        );
        const result = validTokenSchema.safeParse(response);
        if (!result.success) {
            throw new Error("Respuesta inválida del servidor");
        }
        // return result.data;
        return {
            isValid: result.data.data.tokenValid,
            success: result.data.success,
            message: result.data.message
        }
    } catch (error) {
        // Si el error es de autenticación, devolver token inválido en lugar de lanzar error
        if (error instanceof Error && error.message.includes("Inautorizado")) {
            return {
                isValid: false,
                success: false,
                message: "Token inválido o ausente"
            }
        }

        // Para otros errores, sí lanzar la excepción
        throw error;
    }
}