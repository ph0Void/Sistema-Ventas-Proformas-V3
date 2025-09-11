import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ParamIdProps} from "@/model/LayoutProps";
import SeeInvoice from "@/components/invoice/SeeInvoice";
import {SaleService} from "@/service/SaleService";
import {SellerService} from "@/service/SellerService";

export default async function  PageViewSaleOrder({params}: ParamIdProps) {
    const {id} = await params;

    const dataSale = await SaleService.getById(Number(id));
    const dataSeller = await SellerService.getSeller();

    return (
        <div>
            <Breadcrumb pageName={`Detalles de la Venta N°: BLT_${id}`}/>

            {/*  veer los datos de la compra y generar pdf  */}
            <div>
                <SeeInvoice
                    titleInvoice={"Boleta de Venta"}
                    invoice={dataSale.data!}
                    seller={dataSeller.data!}
                />
            </div>


        </div>
    )
}
