"use client";

import React from 'react'
import {z} from "zod";
import {ProformaListResponseSchema} from "@/schema/ProformaSchema";
import {useRouter, useSearchParams} from "next/navigation";
import TableInvoice from "@/components/order/table/TableInvoice";
import {SaleListResponseSchema} from "@/schema/SaleSchema";

interface TableSaleWrapperProps {
    initialSales: z.infer<typeof SaleListResponseSchema>;
}

export default function TableSaleWrapper({initialSales}: TableSaleWrapperProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page.toString());

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`/dashboard/sale${query}`);
    };

    return (
        <TableInvoice
            invoice={initialSales}
            onPageChange={handlePageChange}
            pathName={"/dashboard/sale/view"}
        />
    )
}
