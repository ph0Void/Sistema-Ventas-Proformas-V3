"use client";

import {z} from "zod";
import {CartOrderDetailSchema} from "@/schema/OrderDetailSchema";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {ProductSchema} from "@/schema/ProductSchema";

interface CartSaleState {
    cart: Array<z.infer<typeof CartOrderDetailSchema>>;
    total: number;

    addProductToCart: (product: z.infer<typeof ProductSchema >, quantity: number) => void;
    removeProductFromCart: (product: z.infer<typeof ProductSchema >, quantity: number) => void;
    clearCart: () => void;
}

export const useCartSaleStore = create<CartSaleState>()(
    persist(
        (set, get)=> ({
            cart: [],
            total: 0,

            addProductToCart(product: z.infer<typeof ProductSchema>, quantity: number): void {
                const { cart } = get();

                const productInCart = cart.find((item) => item.product.id === product.id);

                let newCart;
                if (!productInCart) {
                    newCart = [...cart, { product, quantity }];
                } else {
                    newCart = cart.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }

                const newTotal = newCart.reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0
                );

                set({
                    cart: newCart,
                    total: newTotal,
                });
            },

            removeProductFromCart(product: z.infer<typeof ProductSchema>, quantity: number): void {
                const { cart } = get();

                const newCart = cart
                    .map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity - quantity }
                            : item
                    )
                    .filter((item) => item.quantity > 0);

                const newTotal = newCart.reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0
                );

                set({
                    cart: newCart,
                    total: newTotal,
                });
            },

            clearCart(): void {
                set({
                    cart: [],
                    total: 0
                });
            },
        }),
        {
            name: "cart-sale-storage",
        }
    )
)