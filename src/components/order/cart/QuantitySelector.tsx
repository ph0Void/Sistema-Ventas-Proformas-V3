"use client";

import React from 'react'
import {z} from "zod";
import {ProductSchema} from "@/schema/ProductSchema";
import {CircleMinus, CirclePlus} from "lucide-react";

interface QuantitySelectorProps {
    product: z.infer<typeof ProductSchema>;
    quantity: number;

    addProductToCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
    removeProductFromCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
}

export default function QuantitySelector({product, quantity, addProductToCart, removeProductFromCart}: QuantitySelectorProps) {

    return (
        <div className="flex  ">
            <button
                className="cursor-pointer texto-primario"
                onClick={() => addProductToCart(product, 1)}
            >
                <CirclePlus size={30} />
            </button>
            <span className="w-20 mx-3 px-5 text-center texto-secundario" >
                {quantity}
            </span>
            <button
                className="cursor-pointer texto-primario"
                disabled={quantity <= 0}
                onClick={() => removeProductFromCart(product, 1)}
            >
                <CircleMinus size={30} />
            </button>
        </div>
    )
}
