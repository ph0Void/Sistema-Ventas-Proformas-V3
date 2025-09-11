"use client";

import React from 'react'
import {ProductSchema} from "@/schema/ProductSchema";
import {z} from "zod";
import {useCartSaleStore} from "@/store/CartSaleStore";
import OrderProductList from "@/components/order/product/OrderProductList";

interface AddProductSaleWraperProps {
    products: Array<z.infer<typeof ProductSchema>>;
}

export default function AddProductSaleWraper({products}: AddProductSaleWraperProps) {
    const addToCartSale = useCartSaleStore((state) => state.addProductToCart);

    return (
        <>
            <OrderProductList
                products={products}
                addToCart={addToCartSale}
            />
        </>
    )
}
