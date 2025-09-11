import { fetchHelper } from "./helper/FetchHelper";
import { envConfig } from "@/config/EnvConfig";
import {AuthResponseSchema, LoginSchema, RegisterSchema} from "@/schema/AuthSchema";
import { z } from "zod";
import {saveCookieToken} from "@/service/helper/CookieService";

const API_URL = envConfig.API_URL;

export class AuthService {
    /**
     * Registra un nuevo usuario
     */
    static async register(userData: z.infer<typeof RegisterSchema>) {
        const validatedData = RegisterSchema.parse(userData);

        const response = await fetchHelper<z.infer<typeof AuthResponseSchema>>(
            `${API_URL}/auth/register`,
            {
                method: "POST",
                body: JSON.stringify({
                    username: validatedData.username,
                    password: validatedData.password,
                }),
            }
        );

        return AuthResponseSchema.parse(response);
    }

    /**
     * Inicia sesión de usuario
     */
    static async login(userData: z.infer<typeof LoginSchema>) {
        const validatedData = LoginSchema.parse(userData);

        const response = await fetchHelper<z.infer<typeof AuthResponseSchema>>(
            `${API_URL}/auth/login`,
            {
                method: "POST",
                body: JSON.stringify(validatedData),
            }
        );
        await saveCookieToken(response.data.token);
        return AuthResponseSchema.parse(response);
    }
}
