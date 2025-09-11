"use server";

import { ActionState } from "@/model/ActionState";
import { SellerSchema } from "@/schema/SellerSchema";
import { SellerService } from "@/service/SellerService";

export async function CreateSellerAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        const dataRaw = {
            name: formData.get("name"),
            lastName: formData.get("lastName"),
            carnet: Number(formData.get("carnet")),
            storeAddress: formData.get("storeAddress") ,
        }

        // 1. Validar usando la función helper genérica
        const parseResult = SellerSchema.safeParse(dataRaw);

        if (!parseResult.success) {
            return parseResult;
        }

        // 2. Enviar al backend
        const response = await SellerService.create(parseResult.data!);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error al crear el vendedor",
            };
        }

        // 3. Retorno exitoso
        return {
            success: true,
            message: "Vendedor creado exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

export async function UpdateSellerAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        // 1. Validar usando la función helper genérica

        const dataRaw = {
            name: formData.get("name"),
            lastName: formData.get("lastName"),
            carnet: Number(formData.get("carnet")),
            storeAddress: formData.get("storeAddress") ,
        }

        const parseResult = SellerSchema.safeParse(dataRaw);

        if (!parseResult.success) {
            return parseResult;
        }

        // 2. Enviar al backend
        const response = await SellerService.update(parseResult.data);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error al actualizar el vendedor",
            };
        }

        // 3. Retorno exitoso
        return {
            success: true,
            message: "Vendedor actualizado exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}
