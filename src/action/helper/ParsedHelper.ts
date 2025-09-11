import { z } from "zod";
import { ActionState } from "@/model/ActionState";

/**
 * Normaliza los errores de campo para asegurar que cada campo tenga un array de errores.
 * @param fieldErrors
 */
function normalizeFieldErrors(fieldErrors: { [key: string]: string[] | undefined }): Record<string, string[]> {
    const normalized: Record<string, string[]> = {};
    for (const key in fieldErrors) {
        normalized[key] = fieldErrors[key] ?? [];
    }
    return normalized;
}

/**
 * Parsea y valida los datos de un FormData usando un schema de Zod.
 * Si la validación es exitosa, retorna los datos parseados.
 * Si falla, retorna los errores de validación y un estado de acción actualizado.
 * @param schema El schema de Zod para validar los datos.
 * @param formData Los datos del formulario a validar.
 * @param prevState El estado de acción previo para actualizar en caso de error.
 */
export function parseFormData<T>(
    schema: z.ZodSchema<T>,
    formData: FormData,
    prevState?: ActionState
): { success: true; data: T } | { success: false; errors: Record<string, string[]>; state: ActionState } {

    const raw: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
        if (raw[key]) {
            if (Array.isArray(raw[key])) {
                raw[key].push(value);
            } else {
                raw[key] = [raw[key], value];
            }
        } else {
            raw[key] = value;
        }
    }

    const parsed = schema.safeParse(raw);

    if (parsed.success) {
        return {
            success: true,
            data: parsed.data
        };
    } else {
        const { fieldErrors } = parsed.error.flatten();
        const normalizedErrors = normalizeFieldErrors(fieldErrors);
        return {
            success: false,
            errors: normalizedErrors,
            state: {
                ...prevState,
                success: false,
                message: "Error de validación",
                fieldErrors: normalizedErrors
            }
        };
    }
}

/**
 * Parsea y valida un objeto usando un schema de Zod.
 * Si la validación es exitosa, retorna los datos parseados.
 * Si falla, retorna los errores de validación y un estado de acción actualizado.
 * @param schema El schema de Zod para validar los datos.
 * @param obj El objeto a validar.
 * @param prevState El estado de acción previo para actualizar en caso de error.
 */
export function parseObject<T>(
    schema: z.ZodSchema<T>,
    obj: unknown,
    prevState?: ActionState
): { success: true; data: T } | { success: false; errors: Record<string, string[]>; state: ActionState } {

    const parsed = schema.safeParse(obj);

    if (parsed.success) {
        return {
            success: true,
            data: parsed.data
        };
    } else {
        const { fieldErrors } = parsed.error.flatten();
        const normalizedErrors = normalizeFieldErrors(fieldErrors);
        return {
            success: false,
            errors: normalizedErrors,
            state: {
                ...prevState,
                success: false,
                message: "Error de validación",
                fieldErrors: normalizedErrors
            }
        };
    }
}

/**
 * Extrae y convierte campos específicos de un FormData en un objeto.
 * Convierte valores numéricos en strings a números.
 * @param formData El FormData del cual extraer los campos.
 * @param fields Los nombres de los campos a extraer.
 */
export function extractFormFields(formData: FormData, fields: string[]): Record<string, any> {
    const result: Record<string, any> = {};

    for (const field of fields) {
        const value = formData.get(field);
        if (value !== null) {
            if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
                result[field] = Number(value);
            } else {
                result[field] = value;
            }
        }
    }

    return result;
}