"use client";

import React from 'react'
import {ProductSchema} from "@/schema/ProductSchema";
import {z} from "zod";
import {ShoppingBag} from "lucide-react";
import Image from "next/image";

interface TableItemProps {
    products: Array<z.infer<typeof ProductSchema>>;
    addToCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
}

export default function ListProduct({products, addToCart}: TableItemProps) {

    return (
        <div>
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-2xl font-semibold texto-primario">
                    Productos ({products.length})
                </h4>
            </div>

            <div className="grid grid-cols-6 dark:bg-slate-700 py-4.5 px-4 sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium text-black dark:text-white">
                        Nombre del producto
                    </p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium text-black dark:text-white">
                        Categoría
                    </p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white">
                        Precio
                    </p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white">
                        Stock
                    </p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white">
                        Acciones
                    </p>
                </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] w-full"
                 style={{overflowX: 'hidden'}}
            >
                {products.map(product => (
                    <div
                        key={product.id}
                        className="grid grid-cols-6 border-t py-4.5 px-4
                    sm:grid-cols-8 md:px-6 2xl:px-7.5 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                    >
                        <div className="col-span-3 flex items-center">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className=" rounded-md">
                                    <Image
                                        src={product.urlImage}
                                        width={40}
                                        height={30}
                                        alt={`producto ${product.name}`}
                                        className="h-20 w-22 object-cover rounded-md"
                                    />
                                </div>
                                <p className="text-sm text-black dark:text-white">
                                    {product.name}
                                </p>
                            </div>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="text-sm text-black dark:text-white">
                                {product.category.name}
                            </p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="text-sm text-black dark:text-white">
                                ${product.price}
                            </p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="text-sm text-black dark:text-white">
                                {product.stock}
                            </p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <button
                                className="cursor-pointer mx-2 texto-terciario flex"
                                onClick={() => addToCart(product, 1)}
                            >
                                <ShoppingBag size={50} className="mx-2"/>
                                <span className="hover:underline hover:text-black dark:hover:text-white">
                                Agregar al carrito
                            </span>
                            </button>
                        </div>
                    </div>

                ))}

            </div>
        </div>
    )
}
