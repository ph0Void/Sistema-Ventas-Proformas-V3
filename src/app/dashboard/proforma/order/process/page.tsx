import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import FormProcessOrderProforma from "@/components/proforma/FormProcessOrderProforma";

export default function PageProcessOrder() {
    return (
        <div>
            <Breadcrumb pageName={"Procesar la Proforma"}/>
            {/* contenedor para procesar la venta */}
            <div className=" gap-4" >
                <FormProcessOrderProforma/>
            </div>
        </div>
    )
}
