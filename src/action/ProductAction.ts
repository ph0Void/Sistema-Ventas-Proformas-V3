"use server";

import { ActionState } from "@/model/ActionState";
import { ProductService } from "@/service/ProductService";
import {extractFormFields, parseFormData, parseObject} from "./helper/ParsedHelper";
import {ProductRequestSchema} from "@/schema/ProductSchema";

export async function CreateProductAction(
    prevState: ActionState,
    formData: FormData
) {
    try {
        // 1. Extraer y convertir campos
        const fields = ["name", "description", "urlImage", "price", "stock", "category"];
        const rawFields = extractFormFields(formData, fields);

        // 2. Transformar categoría en objeto
        const productData = {
            ...rawFields,
            price: Number(rawFields.price),
            stock: Number(rawFields.stock),
            category: { name: rawFields.category }
        };

        // 3. Validar usando el schema
        const parseResult = parseObject(ProductRequestSchema, productData, prevState);

        if (!parseResult.success) {
            return parseResult.state;
        }

        // 4. Enviar al backend
        const response = await ProductService.create(parseResult.data);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error en el servidor",
            };
        }

        // 5. Retorno exitoso
        return {
            success: true,
            message: "Producto creado exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}

// src/action/ProductAction.ts
export async function UpdateProductAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        console.log(formData)

        // 1. Extraer ID del producto
        const productId = formData.get("id");
        if (!productId || isNaN(Number(productId))) {
            return {
                ...prevState,
                success: false,
                message: "ID de producto requerido",
            };
        }
        // 1  Extraer y convertir campos
        const fields = ["name", "description", "urlImage", "price", "stock", "category"];
        const rawFields = extractFormFields(formData, fields);

        // 2. Transformar categoría en objeto
        const productData = {
            ...rawFields,
            price: Number(rawFields.price),
            stock: Number(rawFields.stock),
            category: {
                name: rawFields.category
            }
        };

        // 3. Validar usando el schema
        const parseResult = parseObject(ProductRequestSchema, productData, prevState);

        if (!parseResult.success) {
            return parseResult.state;
        }

        // 4. Enviar al backend
        const response = await ProductService.update(Number(productId), parseResult.data);

        if (!response.success) {
            return {
                ...prevState,
                success: false,
                message: response.message || "Error en el servidor",
            };
        }

        // 5. Retorno exitoso
        return {
            success: true,
            message: "Producto actualizado exitosamente",
        };
    } catch (error) {
        return {
            ...prevState,
            success: false,
            message: "Error de conexión",
        };
    }
}
