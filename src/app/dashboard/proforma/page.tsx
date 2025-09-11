import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import ButtonPrimary from "@/components/utils/button/ButtonPrimary";
import {AlertCircle, NotepadText} from "lucide-react";
import Link from "next/link";
import {ProformaService} from "@/service/ProformaService";
import TableProformaWrapper from "@/components/proforma/table/TableProformaWrapper";
import {SaleService} from "@/service/SaleService";

interface PageProformaProps {
    searchParams: { page?: string; size?: string; }
}

export default async function PageProforma({ searchParams }: PageProformaProps) {
    const params = await searchParams;
    const page = Number(params.page) || 0;
    const size = Number(params.size) || 10;

    let datas = null;
    try {
        datas = await ProformaService.getAll(page, size);
    } catch (e) {
        datas = null;
    }


    return (
        <div>
            <Breadcrumb pageName={'Proformas'}>
                <ButtonPrimary >
                    <Link href="/dashboard/proforma/order"
                          className="flex items-center gap-2" >
                        <NotepadText size={30}/>
                        Generar Nueva Proforma
                    </Link>
                </ButtonPrimary>
            </Breadcrumb>

            {/* contenedor para el historial de proformas */}
            <div>
                {datas ? (
                    <TableProformaWrapper
                        initialProformas={datas}
                    />
                ): (
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                        <AlertCircle size={40} className="text-terciario" />
                        <span className="text-secundario text-lg">
                            Sin datos para mostrar.
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
