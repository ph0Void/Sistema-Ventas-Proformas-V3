import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ProductService} from "@/service/ProductService";
import AddProductProformaWrapper from "@/components/proforma/AddProductProformaWrapper";
import OrderCartProformaWrapper from "@/components/proforma/OrderCartProformaWrapper";

export default async function PageNewOrderProforma() {
    const datas = await ProductService.getAll(0, 100);

    return (
        <div>
            <Breadcrumb pageName={"Crear Nueva Proforma"}/>
            {/* contenedor para generar nueva proforma */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/*  Tabla de producto con buscador  */}
                <div className="lg:col-span-2" >
                    <AddProductProformaWrapper products={datas.data.content}/>
                </div>
                {/*  Carrito de compras  */}
                <div className="lg:col-span-1">
                    <OrderCartProformaWrapper />
                </div>
            </div>
        </div>
    )
}
