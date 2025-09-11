"use client";

import React, {useEffect, useState} from 'react'
import {z} from "zod";
import {ChevronLeft, ChevronRight, Package} from "lucide-react";
import {InvoiceTableSchema} from "@/schema/InvoiceSchema";
import InvoiceItem from "@/components/order/table/InvoiceItem";

interface TableSalesProps {
    invoice: z.infer<typeof InvoiceTableSchema>;
    onPageChange?: (page: number) => void;
    pathName: string;
}

export default function TableInvoice({invoice, onPageChange, pathName}: TableSalesProps) {
    const [currentPage, setCurrentPage] = useState(invoice.data.currentPage);

    useEffect(() => {
        setCurrentPage(invoice.data.currentPage);
    }, [invoice.data.currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const totalPages = invoice.data.totalPages;
        const current = currentPage;

        const start = Math.max(0, current - 2);
        const end = Math.min(totalPages - 1, start + 4);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (invoice.data.totalElements === 0) {
        return (
            <div className="rounded-sm bg-white shadow-default dark:bg-slate-600">
                <div className="flex flex-col items-center gap-6 py-20 px-4">
                    <div
                        className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Package size={42} className="text-gray-400 dark:text-gray-500"/>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-medium text-black dark:text-white mb-2">
                            No hay Ordenes registradas
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Agrega tu primera Orden
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-sm bg-white shadow-default dark:bg-slate-800 px-6">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-2xl font-semibold texto-primario">
                    Ordenes ({invoice.data.totalElements})
                </h4>
            </div>

            {/* Header de la tabla */}
            <div className="grid grid-cols-4 md:grid-cols-6 dark:bg-slate-700 py-4.5 px-4 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white text-xs md:text-sm">
                        ID Order
                    </p>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center">
                    <p className="font-medium text-black dark:text-white text-sm">
                        Total Items
                    </p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white text-xs md:text-sm">
                        Total
                    </p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium text-black dark:text-white text-xs md:text-sm">
                        Cliente
                    </p>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center">
                    <p className="font-medium text-black dark:text-white text-sm">
                        Fecha
                    </p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <p className="font-medium text-black dark:text-white text-xs md:text-sm">
                        Acciones
                    </p>
                </div>
            </div>

            {/* Filas de datos */}
            {invoice.data.content.map((item) => (
                <InvoiceItem key={item.id} invoice={item} pathName={pathName}/>
            ))}

            {/* Paginación */}
            {invoice.data.totalPages > 1 && (
                <div
                    className="flex flex-col sm:flex-row items-center justify-between border-t px-4 py-4 md:px-6 2xl:px-7.5 gap-4">
                    <div className="flex items-center text-sm text-black dark:text-white">
                                <span>
                                    Mostrando {invoice.data.content.length} de {invoice.data.totalElements} ordenes
                                </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!invoice.data.hasPrevious}
                            className="flex items-center justify-center w-8 h-8 text-sm
                                    border rounded texto-primario hover:bg-gray-50
                                    disabled:opacity-50 disabled:cursor-not-allowed dark:text-white
                                    transition-colors dark:bg-transparent dark:hover:bg-slate-700"
                        >
                            <ChevronLeft size={16}/>
                        </button>

                        {generatePageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${
                                    page === currentPage
                                        ? 'bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white dark:border-blue-600'
                                        : 'bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600'
                                }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!invoice.data.hasNext}
                            className="flex items-center justify-center w-8 h-8 text-sm
                                    border rounded texto-primario hover:bg-gray-50
                                    disabled:opacity-50 disabled:cursor-not-allowed dark:text-white
                                    transition-colors dark:bg-transparent dark:hover:bg-slate-700"
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}