import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {ProductService} from "@/service/ProductService";
import TableProductWrapper from "@/components/product/table/TableProductWrapper";
import Link from "next/link";
import {Package} from "lucide-react";
import ButtonPrimary from "@/components/utils/button/ButtonPrimary";

interface PageProductProps {
    searchParams: { page?: string; size?: string; }
}

export default async function PageProduct({searchParams}: PageProductProps) {
    const params = await searchParams;
    const page = Number(params.page) || 0;
    const size = Number(params.size) || 5;

    const datas = await ProductService.getAll(page, size);

    return (
        <div>
            <Breadcrumb pageName={'Productos'}>
                <ButtonPrimary>
                    <Link href="/dashboard/product/new" className="flex items-center gap-2">
                        <Package size={20}/>
                        Nuevo Producto
                    </Link>
                </ButtonPrimary>
            </Breadcrumb>

            <div>
                <TableProductWrapper
                    initialProducts={datas}
                />
            </div>
        </div>
    )
}