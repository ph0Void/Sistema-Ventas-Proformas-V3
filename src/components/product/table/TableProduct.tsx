"use client";

import React, {useEffect, useState} from 'react'
import { z } from "zod";
import { ProductListResponseSchema } from "@/schema/ProductSchema";
import ItemProduc from "@/components/product/table/ItemProduc";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

interface TableProductProps {
    products: z.infer<typeof ProductListResponseSchema>;
    onPageChange?: (page: number) => void;
}

export default function TableProduct({ products, onPageChange }: TableProductProps) {
    const [currentPage, setCurrentPage] = useState(products.data.currentPage);

    // Sincroniza el estado cuando cambian los productos
    useEffect(() => {
        setCurrentPage(products.data.currentPage);
    }, [products.data.currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const totalPages = products.data.totalPages;
        const current = currentPage;

        let start = Math.max(0, current - 2);
        let end = Math.min(totalPages - 1, start + 4);

        if (end - start < 4) {
            start = Math.max(0, end - 4);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };



    if (products.data.totalElements === 0) {
        return (
            <div className="rounded-sm  bg-white shadow-default dark:bg-slate-600 ">
                <div className="flex flex-col items-center gap-6 py-20 px-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Package size={42} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-medium text-black dark:text-white mb-2">
                            No hay productos registrados
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Agrega tu primer producto para comenzar a hacer seguimiento
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-sm  bg-white shadow-default dark:bg-slate-800 px-6 ">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-2xl font-semibold texto-primario">
                    Productos ({products.data.totalElements})
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

            {products.data.content.map((product, key) => (
                <ItemProduc key={product.id || key} product={product} />
            ))}

            {/* Paginación */}
            {products.data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-4 md:px-6 2xl:px-7.5">
                    <div className="flex items-center text-sm text-black dark:text-white">
                        <span>
                            Mostrando {products.data.content.length} de {products.data.totalElements} productos
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Botón anterior */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!products.data.hasPrevious}
                            className="flex items-center justify-center w-8 h-8 text-sm
                            border rounded texto-primario hover:bg-gray-50
                            disabled:opacity-50 disabled:cursor-not-allowed  dark:text-white
                            transition-colors dark:bg-transparent dark:hover:bg-slate-700"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Números de página */}
                        {generatePageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${
                                    page === currentPage
                                        ? 'bg-indigo-500 text-white  dark:bg-indigo-600 dark:text-white dark:border-blue-600'
                                        : 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600'
                                }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        {/* Botón siguiente */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!products.data.hasNext}
                            className="flex items-center justify-center w-8 h-8 text-sm
                            border rounded texto-primario hover:bg-gray-50
                            disabled:opacity-50 disabled:cursor-not-allowed  dark:text-white
                            transition-colors dark:bg-transparent dark:hover:bg-slate-700"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
