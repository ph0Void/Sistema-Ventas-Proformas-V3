"use client";

import React from 'react'
import {z} from "zod";
import {ProductListResponseSchema} from "@/schema/ProductSchema";
import CardBlobb from "@/components/home/item/CardBlobb";
import {Package} from "lucide-react";
import {SaleListResponseSchema} from "@/schema/SaleSchema";
import {ProformaListResponseSchema} from "@/schema/ProformaSchema";
import {formatMoney} from "@/utils/FormatHelper";

interface StadisticCardsProps {
    products: z.infer<typeof ProductListResponseSchema> | null;
    sales: z.infer<typeof SaleListResponseSchema> | null;
    proformas: z.infer<typeof ProformaListResponseSchema> | null;
}

export default function StadisticCards({ products, sales, proformas }: StadisticCardsProps) {
    // Si cualquier dato es nulo, mostrar mensaje o nada
    if (!products || !sales || !proformas) {
        return <div className="col-span-4 text-center text-gray-500 dark:text-gray-400 py-8">Sin datos para mostrar.</div>;
    }

    const productsOutOfStock = products.data.content.filter(product => product.stock === 0).length;
    const totalSales = sales.data.content.reduce((acc, sale) => acc + sale.total, 0);

    // Estadísticas adicionales
    const totalVentas = sales.data.totalElements;
    const totalProformas = proformas.data.totalElements;
    const proformasPendientes = totalProformas - totalVentas >= 0 ? totalProformas - totalVentas : 0;

    // total clientes únicos en ventas
    const uniqueClientsSales = new Set(
        sales.data.content.map(sale => sale.client?.dni)
    );
    const totalClientsSales = uniqueClientsSales.size;

    // total clientes únicos en proformas
    const uniqueClientsProformas = new Set(
        proformas.data.content.map(proforma => proforma.client?.dni)
    );
    const totalClientsProformas = uniqueClientsProformas.size;

    const totalClients = new Set([
        ...Array.from(uniqueClientsSales),
        ...Array.from(uniqueClientsProformas)
    ]).size;

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6' >
            {/* total de productos */}
            <CardBlobb
                classname='bg-blue-100 dark:bg-blue-900/20 hover:bg-white/20 dark:hover:bg-blue-700/30'
                icon={<Package size={30} />}
                title="Total de productos"
                value={products.data.totalElements.toString()}
                footer={`Productos sin stock: ${productsOutOfStock}`}
            />
            {/* total de ventas  */}
            <CardBlobb
                classname='bg-red-100 dark:bg-red-900/20 hover:bg-white/20 dark:hover:bg-red-700/30'
                icon={<Package size={30} />}
                title="Total de ventas"
                value={totalVentas.toString()}
                footer={`Ganancia total de ventas: ${formatMoney(totalSales)}`}
            />
            {/* total de proformas hechas  */}
            <CardBlobb
                classname='bg-green-100 dark:bg-green-900/20 hover:bg-white/20 dark:hover:bg-green-700/30'
                icon={<Package size={30} />}
                title="Total de proformas"
                value={totalProformas.toString()}
                footer={`Pendientes: ${proformasPendientes}`}
            />
            {/* Estadísticas útiles */}
            <CardBlobb
                classname='bg-yellow-100 dark:bg-yellow-900/20 hover:bg-white/20 dark:hover:bg-yellow-700/30'
                icon={<Package size={30} />}
                title="Total de clientes"
                value={totalClients.toString()}
                footer={`Clientes Ventas: ${totalClientsSales} - Clientes Proformas: ${totalClientsProformas}`}
            />
        </div>
    )
}
