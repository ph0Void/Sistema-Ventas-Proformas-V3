// src/service/FetchHelpers.ts
"use server";

import { getCookieToken } from "./CookieService";

/** Helper para realizar peticiones fetch
 * con configuración automática
 * @generic T - Tipo de respuesta esperada
 * @param url URL del endpoint
 * @param options Opciones adicionales para la petición
 * */
export async function fetchHelper<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        const token = await getCookieToken();
        const headers = {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            // console.error(`
            //     Error al hacer fetch:
            //       - Status: ${response.status}
            //       - Respuesta: ${errorText}
            // `);
            throw new Error(errorText);
        }

        // Siempre parseamos a JSON cuando se especifica un tipo genérico
        return (await response.json()) as T;
    } catch (error) {
        //console.error("Error en fetchHelper:", error);
        throw error;
    }
}

/**
 * Helper para manejar errores en fetch
 * @param message Mensaje de error
 * @param error Error original
 * @returns Mensaje de error detallado
 */
export async function fetchHelperError(
    message: string,
    error: unknown
) {
    if (error instanceof Error) {
        // Intenta parsear el mensaje si parece JSON
        try {
            const parsed = JSON.parse(error.message);
            if (parsed && typeof parsed === "object" && parsed.message) {
                message += parsed.message;
            } else {
                message += error.message;
            }
        } catch {
            message += error.message;
        }
    } else {
        message += String(error);
    }
    return message;
}