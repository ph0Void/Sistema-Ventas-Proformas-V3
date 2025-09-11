// src/service/CookieService.ts
"use server";

import { cookies } from "next/headers";
import {envConfig} from "@/config/EnvConfig";

const COOKIE_NAME = envConfig.COOKIE_NAME || "token";

/**
 * Guardar el token en una cookie
 */
export async function saveCookieToken(token: string) {
    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        // true - solo el servidor puede acceder a la cookie
        // false - el cliente también puede acceder a la cookie
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });
}
/**
 * Obtener el token de la cookie
 * */
export async function getCookieToken() {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function deleteCookieToken() {
    (await cookies()).delete(COOKIE_NAME);
}