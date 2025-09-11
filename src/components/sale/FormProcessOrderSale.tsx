"use client";

import React, {useState} from 'react'
import FormClientRegister from "@/components/client/FormClientRegister";
import Link from "next/link";
import {ShoppingCart} from "lucide-react";
import {useRouter} from "next/navigation";
import {useCartSaleStore} from "@/store/CartSaleStore";
import {useClientStore} from "@/store/ClientStore";
import {SaleService} from "@/service/SaleService";
import {toast} from "sonner";
import OrderCartSaleWrapper from "@/components/sale/OrderCartSaleWrapper";

export default function FormProcessOrderSale() {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // orden del carrito
    const getShoppingCart = useCartSaleStore(state => state.cart);
    const clearCart = useCartSaleStore(state => state.clearCart);

    // datos del cliente
    const getClient = useClientStore(state => state.client);
    const clearClient = useClientStore(state => state.clearClient);

    // generar orden de venta
    const handleGenerateOrden = async () => {
        try{
            setIsLoading(true);
            const orderItems = getShoppingCart.map(item => ({
                productId: item.product.id!,
                quantity: item.quantity!,
            }));
            const response = await SaleService.create({
                client: getClient,
                orderDetails: orderItems
            });
            if (!response.success){
                toast.error(response.message);
                setIsLoading(false);
                return;
            }
            toast.success(response.message);
            clearCart();
            await new Promise(resolve => setTimeout(resolve, 500)); // espera medio segundo para mejorar UX
            clearClient();
            //router.push(`/dashboard/sale/view/${response.data?.id}`);
            router.push(`/dashboard/sale`);

        }catch (error){
            toast.error('Error al generar la orden de venta');
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-3 gap-6 p-4" >
            {/* DATOS DEL CLIENTE */}
            <div className='col-span-2 rounded-sm  bg-slate-100 dark:bg-[#24303F] shadow-default  shadow-md p-6' >
                <h2 className='text-2xl texto-secundario font-bold mb-4' >
                    Datos del Cliente
                </h2>
                <FormClientRegister />
            </div>
            {/*  RESUMEN DE COMPRAS  */}
            <div className='rounded-xl  bg-slate-100 dark:bg-[#24303F]
             p-4 shadow-default flex flex-col max-h-[calc(100vh-100px)]' >
                <Link
                    href={'/dashboard/sale/order'}
                    className='texto-cuaternario hover:underline hover:text-blue-700 mb-4 cursor-pointer'
                >
                    Agregar mas productos
                </Link>

                <h2 className='text-2xl texto-primario font-bold mb-4' >
                    Orden de Venta
                </h2>

                {/* Carrito de compras */}
                <OrderCartSaleWrapper seeAction={false} />
                {/* boton procesar */}
                {getShoppingCart.length > 0 && (
                    <div className="pt-4 mt-auto">
                        <button
                            className={`w-full ${isLoading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}
                            text-white font-bold py-3 px-6 rounded-lg shadow-md 
                            transition-colors duration-300 flex items-center justify-center cursor-pointer`}
                            onClick={handleGenerateOrden}
                            disabled={isLoading}
                        >
                            <ShoppingCart size={20} className="mr-2" />
                            {isLoading ? 'PROCESANDO...' : 'GENERAR ORDEN'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
