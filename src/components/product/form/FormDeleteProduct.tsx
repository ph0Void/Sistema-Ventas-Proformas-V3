"use client";

import React from 'react'
import ModalBase from "@/components/utils/modal/ModalBase";
import {Trash} from "lucide-react";
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import {useRouter} from "next/navigation";
import {ProductService} from "@/service/ProductService";
import {toast} from "sonner";

interface FormDeleteProductProps {
    product: z.infer<typeof ProductSchema>;
}

export default function FormDeleteProduct({product}: FormDeleteProductProps) {
    const router = useRouter();

    const handleDeleteBudget = async () => {
        const result = await ProductService.delete(product.id!);
        if (result.success) {
            router.push(`/dashboard/product`, { scroll: false });
            toast.success(result.message ?? "Presupuesto eliminado");
            router.refresh();
        }
    };

    return (
        <ModalBase
            modalTitle={"ELIMINAR PRODUCTO"}
            iconButton={<Trash size={30} className="text-red-600" />}
            buttonPersonalizado={true}
        >
            <div className="p-4" >

                <div>
                    <p className="text-xl text-black dark:text-white">
                        ¿Estás seguro que deseas eliminar el producto
                        <span className="font-bold">
                            {product.name}
                        </span>?
                        <span className="text-gray-600 dark:text-gray-400 block mt-2">
                            Esta acción no se puede deshacer.
                        </span>
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 "
                >
                    <button
                        type="button"
                        className="rounded-md bg-red-600 px-3.5 py-2.5 cursor-pointer
                        text-center text-sm font-semibold text-white shadow-sm
                        hover:bg-red-500 focus-visible:outline focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        onClick={handleDeleteBudget}
                    >
                        Eliminar
                    </button>

                </div>
            </div>
        </ModalBase>
    )
}
