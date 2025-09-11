"use client";

import React from 'react'
import {useCartProformaStore} from "@/store/CartProformaStore";
import {ProductSchema} from "@/schema/ProductSchema";
import {z} from "zod";
import OrderProductList from "@/components/order/product/OrderProductList";

interface AddProductProformaWraperProps {
    products: Array<z.infer<typeof ProductSchema>>;
}

export default function AddProductProformaWrapper({products}: AddProductProformaWraperProps) {
    const addToCartProforma = useCartProformaStore((state) => state.addProductToCart);
    return (
        <>
            <OrderProductList
                products={products}
                addToCart={addToCartProforma}
            />
        </>
    )
}
