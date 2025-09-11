"use client";

import React from 'react'
import {z} from "zod";
import {ProformaListResponseSchema} from "@/schema/ProformaSchema";
import {useRouter, useSearchParams} from "next/navigation";
import TableInvoice from "@/components/order/table/TableInvoice";

interface TableProformaWrapperProps {
    initialProformas: z.infer<typeof ProformaListResponseSchema>;
}

export default function TableProformaWrapper({ initialProformas }: TableProformaWrapperProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page.toString());

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`/dashboard/proforma${query}`);
    };

    return (
        <TableInvoice
            invoice={initialProformas}
            onPageChange={handlePageChange}
            pathName={"/dashboard/proforma/view"}
        />
    )
}
