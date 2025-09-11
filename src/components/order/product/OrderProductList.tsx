"use client";

import React, {useState} from 'react'
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import {Package, Search} from "lucide-react";
import ListProduct from "@/components/order/product/ListProduct";

interface OrderProductListProps {
    products: Array<z.infer<typeof ProductSchema>>;
    addToCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
}

export default function OrderProductList({products, addToCart}: OrderProductListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // const productsFilter = products.filter(
    //     (product)=>{
    //         const mathchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    //         return mathchesSearch;
    //     }
    // )

    const productsFilter = products.filter((product) => {
        const search = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(search);
        const matchesCategory = product.category?.name.toLowerCase().includes(search);
        return matchesName || matchesCategory;
    });


    return (
        <div className="rounded-sm  bg-white shadow-default dark:bg-slate-800 p-6 " >
            {/*  BUSCADOR  */}
            <div className="mb-4">
                <div className="relative texto-secundario">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {/*  LISTA DE PRODUCTOS  */}
            {productsFilter.length === 0 ? (
                <div className="rounded-sm  bg-white shadow-default dark:bg-slate-600 ">
                    <div className="flex flex-col items-center gap-6 py-20 px-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Package size={42} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-medium text-black dark:text-white mb-2">
                                No hay productos que coincidan con la búsqueda
                            </p>
                        </div>
                    </div>
                </div>
            ): (
                    <ListProduct
                        products={productsFilter}
                        addToCart={addToCart}
                    />
            )}
        </div>
    )
}
