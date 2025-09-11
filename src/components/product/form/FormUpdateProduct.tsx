"use client";

import React, {useActionState, useEffect, useState} from 'react'
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import FormBase from "@/components/utils/form/FormBase";
import {useRouter} from "next/navigation";
import {UpdateProductAction} from "@/action/ProductAction";
import {CreateInitialActionState} from "@/model/ActionState";
import {toast} from "sonner";
import ErrorMessage from "@/components/utils/alert/ErrorMessage";
import LabelImageUpload from "@/components/cloudinary/LabelImageUpload";

interface FormUpdateProductProps {
    // Define any props if needed
    product: z.infer<typeof ProductSchema>;
}

export default function FormUpdateProduct({product}: FormUpdateProductProps) {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        UpdateProductAction,
        CreateInitialActionState<typeof ProductSchema>()
    );
    // Inicializar con la imagen actual del producto
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(product.urlImage || "");
    const [hasNewImage, setHasNewImage] = useState<boolean>(false);

    // toast de error
    useEffect(() => {
        if (!pending && state.message && !state.success) {
            toast.error(state.message);
        }
    }, [pending, state.message, state.success]);

    // éxito: toast, cerrar modal y refrescar lista
    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Producto actualizado exitosamente");
            const id = setTimeout(() => {
                // Navega y recarga la página
                router.replace('/dashboard/product');
            }, 400);
            return () => clearTimeout(id);
        }
    }, [state.success, state.message, router]);

    // Manejar imagen subida
    const handleImageUploaded = (url: string) => {
        setUploadedImageUrl(url);
        setHasNewImage(true); // Marcar que hay una nueva imagen
    };

    // Manejar imagen removida
    const handleImageRemoved = () => {
        setUploadedImageUrl("");
        setHasNewImage(false);
    };

    // Enviar formulario con URL de imagen
    const handleFormSubmit = (formData: FormData) => {
        // Determinar qué imagen usar
        let finalImageUrl = "";

        if (hasNewImage) {
            // Si hay una nueva imagen subida, usar esa
            finalImageUrl = uploadedImageUrl;
        } else {
            // Si no hay nueva imagen, usar la imagen actual del producto
            finalImageUrl = product.urlImage || "";
        }

        if (!finalImageUrl) {
            toast.error("Debes tener una imagen del producto");
            return;
        }

        // Agregar la URL de la imagen al FormData
        formData.append("urlImage", finalImageUrl);

        console.log("Enviando imagen:", finalImageUrl); // Debug
        formAction(formData);
    };

    return (
        <FormBase
            title={"Actualizar Producto"}
            btnText={pending ? "Actualizando..." : "Actualizar"}
            pending={pending}
            onClose={()=>router.back()}
            action={handleFormSubmit}
        >
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* el id va en una campo escondido  */}
                <input type="hidden" name="id" defaultValue={product.id}/>


                <div className="xl:col-span-3 space-y-4 gap-4 ">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="texto-secundario text-xl font-medium">
                            Nombre *
                        </label>
                        <input
                            id="name"
                            name="name"
                            autoComplete="off"
                            autoFocus
                            required
                            className="w-full rounded-lg border border-gray-300 dark:border-white/10
                              texto-cuaternario bg-tertiary px-3 py-2.5 outline-none
                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                              disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Ingresa el nombre del producto"
                            disabled={pending}
                            defaultValue={product.name}
                        />
                        {state.fieldErrors?.name?.map((error, i) => (
                            <ErrorMessage key={i} message={error} />
                        ))}
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="texto-secundario text-xl font-medium">
                            Descripción *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            autoComplete="off"
                            required
                            className="w-full rounded-lg border border-gray-300 dark:border-white/10
                              texto-cuaternario bg-tertiary px-3 py-2.5 outline-none
                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                              disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            placeholder="Describe el producto"
                            disabled={pending}
                            defaultValue={product.description}
                        />
                        {state.fieldErrors?.description?.map((error, i) => (
                            <ErrorMessage key={i} message={error} />
                        ))}
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="texto-secundario text-xl font-medium">
                            Categoría *
                        </label>
                        <input
                            id="category"
                            name="category"
                            autoComplete="off"
                            required
                            className="w-full rounded-lg border border-gray-300 dark:border-white/10
                              texto-cuaternario bg-tertiary px-3 py-2.5 outline-none
                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                              disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Nombre de la categoría"
                            disabled={pending}
                            defaultValue={product.category.name}
                        />
                        {state.fieldErrors?.category?.map((error, i) => (
                            <ErrorMessage key={i} message={error} />
                        ))}
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="price" className="texto-secundario text-xl font-medium">
                                Precio *
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                autoComplete="off"
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-white/10
                                  texto-cuaternario bg-tertiary px-3 py-2.5 outline-none
                                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="0.00"
                                disabled={pending}
                                defaultValue={product.price}
                            />
                            {state.fieldErrors?.price?.map((error, i) => (
                                <ErrorMessage key={i} message={error} />
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stock" className="texto-secundario text-xl font-medium">
                                Stock *
                            </label>
                            <input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                autoComplete="off"
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-white/10
                                  texto-cuaternario bg-tertiary px-3 py-2.5 outline-none
                                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="0"
                                disabled={pending}
                                defaultValue={product.stock}
                            />
                            {state.fieldErrors?.stock?.map((error, i) => (
                                <ErrorMessage key={i} message={error} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sección de imagen */}
                <div className="xl:col-span-2">
                    <LabelImageUpload
                        onImageUploaded={handleImageUploaded}
                        onImageRemoved={handleImageRemoved}
                        disabled={pending}
                        label="Imagen del producto"
                        required={false} // No requerida en actualización
                        maxSizeMB={5}
                        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                        defaultImageUrl={product.urlImage}
                    />
                    {state.fieldErrors?.urlImage?.map((error, i) => (
                        <ErrorMessage key={i} message={error} />
                    ))}
                </div>
            </div>
        </FormBase>
    )
}
