"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { z } from "zod";
import { ProductListResponseSchema } from "@/schema/ProductSchema";
import TableProduct from "./TableProduct";

interface TableProductWrapperProps {
    initialProducts: z.infer<typeof ProductListResponseSchema>;
}

export default function TableProductWrapper({ initialProducts }: TableProductWrapperProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page.toString());

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`/dashboard/product${query}`);
    };

    return (
        <TableProduct
            products={initialProducts}
            onPageChange={handlePageChange}
        />
    );
}