"use client";

import React from 'react'
import {ProductSchema} from "@/schema/ProductSchema";
import {z} from "zod";
import Image from "next/image";
import QuantitySelector from "@/components/order/cart/QuantitySelector";
import {CartOrderDetailSchema} from "@/schema/OrderDetailSchema";

interface ListOrderCartProps {
    cart: Array<z.infer<typeof CartOrderDetailSchema>>;
    total: number;

    addProductToCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
    removeProductFromCart: (product: z.infer<typeof ProductSchema>, quantity: number) => void;
}

export default function ListOrderCart({cart,total, addProductToCart, removeProductFromCart}: ListOrderCartProps) {
    return (
        <div>
            {cart.length === 0 ? (
                <div>
                    <p className="text-gray-500 dark:text-shadow-gray-200">
                        El carrito está vacío.
                    </p>
                </div>
            ):(
                <>
                    {/* items del carrito*/}
                    <div className="overflow-y-auto max-h-[calc(100vh-300px)]" >
                        {cart.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex items-center space-x-4 mb-4 "
                            >
                                <Image
                                    className="h-16 w-16 rounded-md object-cover"
                                    width={30}
                                    height={40}
                                    src={item.product.urlImage}
                                    alt={item.product.name}
                                />
                                <div>
                                    <h3 className="text-sm font-semibold texto-secundario">
                                        {item.product.name}
                                    </h3>
                                    <p className="texto-terciario">
                                        ${item.product.price.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <QuantitySelector
                                        product={item.product}
                                        quantity={item.quantity}
                                        addProductToCart={addProductToCart}
                                        removeProductFromCart={removeProductFromCart}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Resumen de la compra */}
                    <div className="mt-auto pt-2 border-t border-gray-200 dark:border-slate-600">
                        <p className="texto-cuaternario text-right font-semibold">
                            Total: ${total.toFixed(2)}
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
