"use client";

import React from 'react'
import {InvoiceSchema} from "@/schema/InvoiceSchema";
import {Eye} from "lucide-react";
import {z} from "zod";
import {formatDate, formatMoney} from "@/utils/FormatHelper";
import {useRouter} from "next/navigation";

interface InvoiceItemProps {
    invoice: z.infer<typeof InvoiceSchema>;
    pathName: string;
}

export default function InvoiceItem({invoice, pathName}: InvoiceItemProps) {
    const router = useRouter();

    return (
        <div
            className="grid grid-cols-4 md:grid-cols-6 border-t py-4.5 px-4 md:px-6 2xl:px-7.5 hover:bg-gray-200 dark:hover:bg-slate-700/50">
            {/* ID Order */}
            <div className="col-span-1 flex items-center">
                <p className="text-xs md:text-sm text-black dark:text-white font-medium">
                    #INV_{invoice.id}
                </p>
            </div>

            {/* Total Items - Solo visible en md+ */}
            <div className="hidden md:flex md:col-span-1 items-center">
                <p className="text-sm text-black dark:text-white">
                    {invoice.count_product}
                </p>
            </div>

            {/* Total */}
            <div className="col-span-1 flex items-center">
                <p className="text-xs md:text-sm text-black dark:text-white font-semibold">
                    {formatMoney(invoice.total)}
                </p>
            </div>

            {/* Cliente */}
            <div className="col-span-1 flex items-center">
                <p className="text-xs md:text-sm text-black dark:text-white truncate">
                    {invoice.client.fullName}
                </p>
            </div>

            {/* Fecha - Solo visible en md+ */}
            <div className="hidden md:flex md:col-span-1 items-center">
                <p className="text-sm text-black dark:text-white">
                    {formatDate(invoice.createAt)}
                </p>
            </div>

            {/* Acciones */}
            <div className="col-span-1 flex items-center justify-center">
                <button
                    className="cursor-pointer p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                    onClick={() => router.push(`${pathName}/${invoice.id}`)}
                    title="Ver detalles"
                >
                    <Eye size={20} className="text-blue-600 dark:text-blue-400"/>
                </button>
            </div>
        </div>
    )
}