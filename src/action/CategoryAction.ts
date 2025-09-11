"use server";

import { ActionState } from "@/model/ActionState";
import { CategorySchema } from "@/schema/CategorySchema";
import { CategoryService } from "@/service/CategoryService";
import { parseFormData, parseObject } from "./helper/ParsedHelper";

export async function CreateCategoryAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    // 1. Validar usando la función helper genérica
    const parseResult = parseFormData(CategorySchema, formData, prevState);

    if (!parseResult.success) {
        return parseResult.state;
    }

    try {
        // 2. Enviar al backend
        const response = await CategoryService.create({
            name: parseResult.data.name
        });

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
            message: "Categoría creada exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

export async function UpdateCategoryAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    // 1. Validar usando la función helper genérica
    const parseResult = parseFormData(CategorySchema, formData, prevState);

    if (!parseResult.success) {
        return parseResult.state;
    }

    // Verificar que el ID esté presente
    if (!parseResult.data.id) {
        return {
            ...prevState,
            success: false,
            message: "ID de categoría requerido",
        };
    }

    try {
        // 2. Enviar al backend
        const response = await CategoryService.update(parseResult.data.id, {
            name: parseResult.data.name
        });

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
            message: "Categoría actualizada exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

// Ejemplo de uso con parseObject para datos que vienen de JSON
export async function DeleteCategoryAction(
    prevState: ActionState,
    categoryData: { id: number }
): Promise<ActionState> {
    // 1. Validar usando parseObject con un schema simple
    const IdSchema = CategorySchema.pick({ id: true });
    const parseResult = parseObject(IdSchema, categoryData, prevState);

    if (!parseResult.success) {
        return parseResult.state;
    }

    try {
        // 2. Enviar al backend
        const response = await CategoryService.delete(parseResult.data.id!);

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
            message: "Categoría eliminada exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}
