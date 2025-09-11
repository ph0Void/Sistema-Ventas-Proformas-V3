import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ProductService} from "@/service/ProductService";
import AddProductSaleWraper from "@/components/sale/AddProductSaleWraper";
import OrderCartSaleWrapper from "@/components/sale/OrderCartSaleWrapper";

export default async function PageNewOrderSale() {

    const datas = await ProductService.getAll(0, 100);

    return (
        <div>
            <Breadcrumb pageName={"Crear Nueva Venta"}/>
            {/* contenedor para generar nueva venta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/*  Tabla de producto con buscador  */}
                <div className="lg:col-span-2" >
                    <AddProductSaleWraper products={datas.data.content}/>
                </div>
                {/*  Carrito de compras  */}
                <div className="lg:col-span-1">
                    <OrderCartSaleWrapper />
                </div>
            </div>
        </div>
    )
}
