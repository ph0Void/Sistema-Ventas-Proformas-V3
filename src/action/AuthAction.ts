"use server";

import {ActionState} from "@/model/ActionState";
import {LoginSchema, RegisterSchema} from "@/schema/AuthSchema";
import { parseFormData } from "./helper/ParsedHelper";
import {deleteCookieToken} from "@/service/helper/CookieService";
import {redirect} from "next/navigation";
import {AuthService} from "@/service/AuthService";

/**
 * Acción para manejar el inicio de sesión.
 *
 * @param prevState
 * @param formData
 * @constructor
 */
export async function LoginAction(
    prevState: ActionState<typeof LoginSchema>,
    formData: FormData
){
    // 1. Validar usando la función helper genérica
    const parseResult = parseFormData(LoginSchema, formData, prevState);

    if (!parseResult.success) {
        return parseResult.state;
    }

    try {
        // 2. Enviar al backend
        const response = await AuthService.login(parseResult.data);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error en el servidor",
            };
        }

        // 3. Retorno exitoso
        return {
            success: true,
            message: "Inicio de sesión exitoso",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

export async function RegisterAction(
    prevState: ActionState<typeof RegisterSchema>,
    formData: FormData
){
    // 1. Validar usando la función helper genérica
    const parseResult = parseFormData(RegisterSchema, formData, prevState);

    if (!parseResult.success) {
        return parseResult.state;
    }

    try {
        // Extraer solo los campos necesarios para el registro (sin confirmPassword)
        const { confirmPassword, ...registerData } = parseResult.data;

        // 2. Enviar al backend
        const response = await AuthService.register(parseResult.data);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error en el servidor",
            };
        }

        // 3. Retorno exitoso
        return {
            success: true,
            message: "Registro exitoso",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

export async function LogoutAction(){
    await deleteCookieToken();
    redirect('/auth/login')
}