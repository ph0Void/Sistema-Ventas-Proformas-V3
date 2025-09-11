"use client";

import React from 'react'
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import ModalBase from "@/components/utils/modal/ModalBase";
import {Eye} from "lucide-react";
import Image from "next/image";

interface FormViewProductProps {
    product: z.infer<typeof ProductSchema>;
}

export default function FormViewProduct({product}: FormViewProductProps) {

    return (
        <ModalBase
            iconButton={<Eye size={20} className="text-green-600"/>}
            modalTitle={`Detalles del Producto`}
        >
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Imagen del producto */}
                    <div className="flex justify-center">
                        <div
                            className="w-full max-w-sm aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                                width={300}
                                height={300}
                                src={product.urlImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                                {product.name}
                            </h3>
                            <span
                                className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                            {product.category.name}
                                        </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Precio</p>
                                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                    ${product.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Stock</p>
                                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                    {product.stock} unidades
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-black dark:text-white mb-3">
                                Descripción
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {product.description || "No hay descripción disponible."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalBase>
    )
}