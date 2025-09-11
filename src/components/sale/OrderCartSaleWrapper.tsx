"use client";

import React from 'react'
import {useCartSaleStore} from "@/store/CartSaleStore";
import ListOrderCart from "@/components/order/cart/ListOrderCart";
import ButtonPrimary from "@/components/utils/button/ButtonPrimary";
import {useRouter} from "next/navigation";
import {ShoppingCart, Trash} from "lucide-react";
import {formatMoney} from "@/utils/FormatHelper";

interface OrderCartSaleWrapperProps {
    seeAction?: boolean;
}

export default function OrderCartSaleWrapper({ seeAction = true }: OrderCartSaleWrapperProps) {

    const router = useRouter();

    const cart = useCartSaleStore(state => state.cart);
    const total = useCartSaleStore(state => state.total);
    const addProductToCart = useCartSaleStore(state => state.addProductToCart);
    const removeProductFromCart = useCartSaleStore(state => state.removeProductFromCart);
    const clearCart = useCartSaleStore(state => state.clearCart);

    return (
        <div className="rounded-sm  bg-white shadow-default dark:bg-slate-800 p-6" >
            <h2 className="text-lg texto-primario font-semibold mb-4">
                Carrito de compras - Total: {formatMoney(total)}
            </h2>

            <div>
                <ListOrderCart
                    cart={cart}
                    total={total}
                    addProductToCart={addProductToCart}
                    removeProductFromCart={removeProductFromCart}
                />
            </div>

            {seeAction && (
                <>
                    { cart.length > 0 && (
                        <div className="flex" >
                            <ButtonPrimary
                                className="bg-red-500 hover:bg-red-600 mr-2
                                dark:bg-red-600 dark:hover:bg-red-700"
                                onClick={clearCart}
                            >
                                <Trash size={30} />
                                <span>Limpiar carrito</span>
                            </ButtonPrimary>
                            <ButtonPrimary
                                onClick={() => router.replace("/dashboard/sale/order/process") }
                            >
                                <ShoppingCart size={30} />
                                Procesar venta
                            </ButtonPrimary>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}
