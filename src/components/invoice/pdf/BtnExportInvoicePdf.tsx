"use client";

import React, {useState} from 'react'
import {InvoiceSchema} from "@/schema/InvoiceSchema";
import {SellerSchema} from "@/schema/SellerSchema";
import {z} from "zod";
import {pdf} from "@react-pdf/renderer";
import InvoicePdf from "@/components/invoice/pdf/InvoicePdf";
import {toast} from "sonner";
import {FileText} from "lucide-react";

interface InvoicePdfProps {
    titleInvoice:string;
    dataInvoice: z.infer<typeof InvoiceSchema>;
    seller: z.infer<typeof SellerSchema> | null;
}

export default function BtnExportInvoicePdf({titleInvoice, dataInvoice, seller}: InvoicePdfProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const handleExportPdf = async () => {
        try {
            setIsGenerating(true);

            // generar el pdf
            const blob = await pdf(
                <InvoicePdf
                    dataInvoice={dataInvoice}
                    title={titleInvoice}
                    seller={seller} />
            ).toBlob();

            // crear la ulr para descargar
            const url = URL.createObjectURL(blob);
            // crear y activar descartga
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice_${titleInvoice}_${dataInvoice.id || "generico"}.pdf`;
            link.click();

            // limpiar
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (exeption) {
            toast.error("Error al generar el PDF de la factura");
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <button
            onClick={handleExportPdf}
            disabled={isGenerating}
            className={`cursor-pointer flex items-center justify-center 
          gap-2 ${isGenerating ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white 
          font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300`}
        >
            <FileText size={30} className="text-xl" />
            {isGenerating ? 'Generando...' : 'Exportar PDF'}
        </button>
    )
}
