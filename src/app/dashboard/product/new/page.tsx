import React from 'react'
import FormAddProduct from "@/components/product/form/FormAddProduct";
import Breadcrumb from "@/components/ui/menu/Breadcrumb";

export default function PageCreateProduct() {
    return (
        <div>
            <Breadcrumb pageName="Crear Producto"/>
            <div className="" >
                <FormAddProduct/>
            </div>
        </div>
    )
}
