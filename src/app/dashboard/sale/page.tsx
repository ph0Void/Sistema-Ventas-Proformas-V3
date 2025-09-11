import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import Link from "next/link";
import {Handbag, AlertCircle} from "lucide-react";
import ButtonPrimary from "@/components/utils/button/ButtonPrimary";
import {SaleService} from "@/service/SaleService";
import TableSaleWrapper from "@/components/sale/table/TableSaleWrapper";

interface PageSaleProps {
    searchParams: { page?: string; size?: string; }
}

export default async function PageSale({ searchParams }: PageSaleProps) {
    const params = await searchParams;
    const page = Number(params.page) || 0;
    const size = Number(params.size) || 10;

    let datas = null;
    try {
        datas = await SaleService.getAll(page, size);
    } catch (e) {
        datas = null;
    }

    return (
        <div>
            <Breadcrumb pageName={'Ventas'} >
                <ButtonPrimary>
                    <Link href="/dashboard/sale/order"
                          className="flex items-center gap-2">
                        <Handbag size={30}/>
                        Generar Nueva Venta
                    </Link>
                </ButtonPrimary>
            </Breadcrumb>
            {/* contenedor para el historial de ventas */}
            <div>
                {datas ? (
                    <TableSaleWrapper
                        initialSales={datas}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                        <AlertCircle size={40} className="text-terciario" />
                        <span className="text-secundario text-lg">Sin datos para mostrar.</span>
                    </div>
                )}
            </div>
        </div>
    )
}
