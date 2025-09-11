"use client";

import React from 'react'
import {z} from "zod";
import {InvoiceSchema} from "@/schema/InvoiceSchema";
import {SellerSchema} from "@/schema/SellerSchema";
import {formatDate, formatMoney} from "@/utils/FormatHelper";
import BtnExportInvoicePdf from "@/components/invoice/pdf/BtnExportInvoicePdf";

interface SeeInvoiceProps {
    titleInvoice: string;
    invoice: z.infer<typeof InvoiceSchema>;
    seller: z.infer<typeof SellerSchema>;
}

export default function SeeInvoice({titleInvoice, invoice, seller}: SeeInvoiceProps) {
    return (
        <div className=" mx-auto my-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <img src="/logo.ico" alt="Logo" className="w-10 h-10 rounded" />
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{titleInvoice}</h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Boleta electrónica</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
                        Fecha: {formatDate(invoice.createAt)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Boleta N°: BLT_{invoice.id}
                    </div>
                </div>
            </div>

            {/* Datos del cliente */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Cliente:</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div>Nombre: {invoice.client.fullName}</div>
                    <div>DNI: {invoice.client.dni}</div>
                    <div>Teléfono: {invoice.client.phone}</div>
                    <div>Email: {invoice.client.email}</div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="px-6 py-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 texto-terciario dark:text-gray-200">
                            <th className="py-2 px-2 text-left">Producto</th>
                            <th className="py-2 px-2 text-center">Cantidad</th>
                            <th className="py-2 px-2 text-right">Precio</th>
                            <th className="py-2 px-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.orderDetails.map((item) => (
                            <tr key={item.id} className="border-b texto-secundario border-gray-100 dark:border-gray-800">
                                <td className="py-2 px-2">{item.product?.name || 'Producto'}</td>
                                <td className="py-2 px-2 text-center">{item.quantity}</td>
                                <td className="py-2 px-2 text-right">{formatMoney(item.product.price)}</td>
                                <td className="py-2 px-2 text-right">{formatMoney(item.product.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Resumen */}
            <div className="px-6 py-4 flex flex-col items-end gap-1 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <div className="flex gap-4 text-gray-700 dark:text-gray-200">
                    <span>Cantidad de productos:</span>
                    <span className="font-semibold">{invoice.count_product}</span>
                </div>
                <div className="flex gap-4 text-gray-700 dark:text-gray-200">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatMoney(invoice.total)}</span>
                </div>
                <div className="flex gap-4 text-gray-700 dark:text-gray-200">
                    <span>IGV (10%):</span>
                    <span className="font-semibold">{formatMoney(invoice.total * 0.10)}</span>
                </div>
                <div className="flex gap-4 text-lg text-gray-900 dark:text-gray-100 font-bold mt-2">
                    <span>Total:</span>
                    <span>{formatMoney(invoice.total * 1.10)}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Atendido por: <span className="font-semibold">{seller?.name} {seller?.lastName}</span> <br />
                    Dirección: {seller?.storeAddress} <br />
                    Carnet: {seller?.carnet} <br />
                    <span className="italic">*El pago se debe entre los 30 días. Los pagos atrasados están sujetos a tarifas.</span>
                </div>
                <BtnExportInvoicePdf
                    titleInvoice={titleInvoice}
                    dataInvoice={invoice}
                    seller={seller}
                />
            </div>
        </div>
    )
}
