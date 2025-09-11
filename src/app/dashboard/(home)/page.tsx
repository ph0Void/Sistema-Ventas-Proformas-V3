import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import StadisticCards from "@/components/home/item/StadisticCards";
import {ProductService} from "@/service/ProductService";
import {SaleService} from "@/service/SaleService";
import {ProformaService} from "@/service/ProformaService";
import DoughnutChartInvoice from "@/components/home/chart/DoughnutChartInvoice";
import BarChartInvoice from "@/components/home/chart/BarChartInvoice";
import { AlertCircle, BarChart2, PieChart, ShoppingCart, Package, Users } from 'lucide-react';

export const metadata = {
    title: 'Sistema de Ventas - Proformas',
    description: 'Dashboard Home',
}

export default async function PageDashboard() {
    const dataProducts = await ProductService.getAll().catch(() => null);
    const dataSales = await SaleService.getAll().catch(() => null);
    const dataProformas = await ProformaService.getAll().catch(() => null);

    // Si todas las datas son null, muestra mensaje general
    if (!dataProducts && !dataSales && !dataProformas) {
        return (
            <div className="px-2 md:px-6 py-4 flex flex-col items-center justify-center gap-4">
                <AlertCircle size={48} className="text-terciario" />
                <div className="text-secundario text-lg">Sin datos para mostrar.</div>
            </div>
        );
    }

    return (
        <div className="px-2 md:px-6 py-4 ">
            <Breadcrumb pageName={"Bienvenido al sistema venta - proforma"}/>

            {/* Estadísticas */}
            <div className="space-y-5 py-5">
                <StadisticCards
                    products={dataProducts}
                    sales={dataSales}
                    proformas={dataProformas}
                />
            </div>

            {/* Gráficos */}
            <div className="flex flex-col md:flex-row gap-8 py-5 items-start justify-between">
                {/* Gráfico de barras por mes  */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 size={30} className="texto-primario mb-2" />
                        <span className="texto-primario font-semibold">
                            Gráfico de Ventas y Proformas por Mes
                        </span>
                    </div>
                    {dataSales && dataProformas ? (
                        <BarChartInvoice
                            sales={dataSales}
                            proformas={dataProformas}
                            months={4}
                        />
                    ) : (
                        <div className="texto-terciario flex items-center gap-2">
                            <AlertCircle size={18}/>
                            Sin datos de ventas o proformas.
                        </div>
                    )}
                </div>
                {/* Gráfico doughnut */}
                <div
                    className="w-full md:w-80 bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <PieChart size={30} className="texto-primario mb-2 " />
                        <span className="texto-primario font-semibold">
                            Distribución Ventas/Proformas
                        </span>
                    </div>
                    {dataSales && dataProformas ? (
                        <DoughnutChartInvoice
                            sales={dataSales}
                            proformas={dataProformas}
                        />
                    ) : (
                        <div className="texto-terciario flex items-center gap-2">
                            <AlertCircle className="texto-secundario" size={18}/>
                            Sin datos de ventas o proformas.
                        </div>
                    )}
                </div>
            </div>

            <div>
                {/* chat bot */}
            </div>
        </div>
    )
}