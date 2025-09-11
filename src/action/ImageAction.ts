"use server";

import { ActionState } from "@/model/ActionState";
import { ImageService } from "@/service/ImageService";

/**
 * Acción para subir una imagen al servidor.
 * Valida el archivo y maneja errores comunes.
 * @param prevState
 * @param formData
 * @constructor
 */
export async function UploadImageAction(
    prevState: ActionState,
    formData: FormData
) {
    try {
        // 1. Extraer el archivo del FormData
        const file = formData.get("file") as File;

        if (!file || !(file instanceof File)) {
            return {
                ...prevState,
                success: false,
                message: "Archivo de imagen requerido",
            };
        }

        // 2. Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return {
                ...prevState,
                success: false,
                message: "Tipo de archivo no permitido. Solo se permiten: JPEG, JPG, PNG, WEBP",
            };
        }

        // 3. Validar tamaño de archivo (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                ...prevState,
                success: false,
                message: "El archivo es demasiado grande. Tamaño máximo: 5MB",
            };
        }

        // 4. Subir imagen al backend
        const response = await ImageService.upload(file);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error al subir la imagen",
            };
        }

        // 5. Retorno exitoso con la URL de la imagen
        return {
            success: true,
            message: "Imagen subida exitosamente",
            // data: {
            //     url: response.data.url
            // }
            data: response.data
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión al subir la imagen",
        };
    }
}
