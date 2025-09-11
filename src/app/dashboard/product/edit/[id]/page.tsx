import React from 'react'
import {ParamIdProps} from "@/model/LayoutProps";
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ProductService} from "@/service/ProductService";
import FormUpdateProduct from "@/components/product/form/FormUpdateProduct";
import ContainItem from "@/components/ui/contain/ContainItem";

export default async function PageEditProduct({params}: ParamIdProps) {
    const {id} = await params;
    const data = await ProductService.getById(Number(id));
    return (
        <div>
            <Breadcrumb pageName={"Edicion del producto"} />

            <ContainItem>
                <FormUpdateProduct product={data.data!}/>
            </ContainItem>
        </div>
    )
}
