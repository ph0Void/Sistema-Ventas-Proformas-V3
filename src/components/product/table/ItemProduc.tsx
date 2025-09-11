"use client";

import React from 'react'
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import Image from "next/image";
import {Eye, SquarePen, Trash} from "lucide-react";
import FormViewProduct from "@/components/product/form/FormViewProduct";
import {useRouter} from "next/navigation";
import FormDeleteProduct from "@/components/product/form/FormDeleteProduct";

interface ItemProducProps {
    product: z.infer<typeof ProductSchema>;
}

export default function ItemProduc({product}: ItemProducProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/dashboard/product/edit/${product.id}`);
    };
    return (
        <div
            className="grid grid-cols-6 border-t py-4.5 px-4
            sm:grid-cols-8 md:px-6 2xl:px-7.5 hover:bg-gray-200 dark:hover:bg-slate-700/50"
        >
            <div className="col-span-3 flex items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                        <Image
                            src={product.urlImage}
                            width={60}
                            height={50}
                            alt="Product"
                        />
                    </div>
                    <p className="text-sm text-black dark:text-white">
                        {product.name}
                    </p>
                </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                    {product.category.name}
                </p>
            </div>
            <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                    ${product.price}
                </p>
            </div>
            <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                    {product.stock}
                </p>
            </div>
            <div className="col-span-1 flex items-center">
                <FormViewProduct product={product}/>
                <FormDeleteProduct product={product}/>

                <button
                    className="cursor-pointer mx-2"
                    onClick={handleEdit}
                >
                    <SquarePen size={30} className="text-blue-600" />
                </button>
            </div>
        </div>
    )
}
