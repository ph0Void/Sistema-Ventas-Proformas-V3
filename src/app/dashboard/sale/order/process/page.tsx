import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import FormProcessOrderSale from "@/components/sale/FormProcessOrderSale";

export default function PageProcessOrder() {
    return (
        <div>
            <Breadcrumb pageName={"Procesar la Venta"}/>
            {/* contenedor para procesar la venta */}
            <div className=" gap-4" >
                <FormProcessOrderSale/>
            </div>
        </div>
    )
}
