"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { CreateProductAction } from "@/action/ProductAction";
import { CreateInitialActionState } from "@/model/ActionState";
import { ProductRequestSchema } from "@/schema/ProductSchema";
import { toast } from "sonner";
import FormBase from "@/components/utils/form/FormBase";
import ErrorMessage from "@/components/utils/alert/ErrorMessage";
import LabelImageUpload from "@/components/cloudinary/LabelImageUpload";

export default function FormAddProduct() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        CreateProductAction,
        CreateInitialActionState<typeof ProductRequestSchema>()
    );

    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

    // Toast de error
    useEffect(() => {
        if (!pending && state.message && !state.success) {
            toast.error(state.message);
        }
    }, [pending, state.message, state.success]);

    // Éxito: toast, cerrar modal y refrescar lista
    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Producto creado exitosamente");
            const id = setTimeout(() => {
                // router.refresh();
                // Navega y recarga la página
                router.replace('/dashboard/product');
                //router.back();
            }, 400);
            return () => clearTimeout(id);
        }
    }, [state.success, state.message, router]);

    // Manejar imagen subida
    const handleImageUploaded = (url: string) => {
        setUploadedImageUrl(url);
    };

    // Manejar imagen removida
    const handleImageRemoved = () => {
        setUploadedImageUrl("");
    };

    // Enviar formulario con URL de imagen
    const handleFormSubmit = (formData: FormData) => {
        if (!uploadedImageUrl) {
            toast.error("Debes subir una imagen primero");
            return;
        }

        // Agregar la URL de la imagen al FormData
        formData.append("urlImage", uploadedImageUrl);

        // NO hagas esto: formData.append("category.name", formData.get("category") as string);
        // El campo "category" ya existe y será transformado correctamente en CreateProductAction
        // formData.append("category.name", formData.get("category") as string);

        formAction(formData);
    };

    return (
        <FormBase
            title={"Agregar Producto"}
            btnText={pending ? "Creando..." : "Crear Producto"}
            pending={pending}
            onClose={() => router.back()}
            action={handleFormSubmit}
        >
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
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
                        required
                        maxSizeMB={5}
                        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                    />
                    {state.fieldErrors?.urlImage?.map((error, i) => (
                        <ErrorMessage key={i} message={error} />
                    ))}
                </div>
            </div>
        </FormBase>
    );
}
