import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ParamIdProps} from "@/model/LayoutProps";
import {SellerService} from "@/service/SellerService";
import {ProformaService} from "@/service/ProformaService";
import SeeInvoice from "@/components/invoice/SeeInvoice";

export default async function  PageViewProformaOrder({params}: ParamIdProps) {
    const {id} = await params;
    const dataProforma = await ProformaService.getById(Number(id));
    const dataSeller = await SellerService.getSeller();

    return (
        <div>
            <Breadcrumb pageName={`Detalles de la Proforma N°: BLT_${id}`}/>

            {/*  veer los datos de la compra y generar pdf  */}
            <div>
                <SeeInvoice
                    titleInvoice={"Boleta de Proforma"}
                    invoice={dataProforma.data!}
                    seller={dataSeller.data!}
                />
            </div>
        </div>
    )
}
