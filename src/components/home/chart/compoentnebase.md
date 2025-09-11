 `````tsx
 "use client";

import React, { useEffect, useState, useMemo } from 'react';
import { SaleListResponseSchema } from "@/schema/SaleSchema";
import { ProformaListResponseSchema } from "@/schema/ProformaSchema";
import { z } from "zod";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartEvent,
    ActiveElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartInvoiceProps {
    sales: z.infer<typeof SaleListResponseSchema>;
    proformas: z.infer<typeof ProformaListResponseSchema>;
}

interface MonthlyData {
    month: string;
    sales: {
        total: number;
        count: number;
        products: number;
        items: any[];
    };
    proformas: {
        total: number;
        count: number;
        products: number;
        items: any[];
    };
}

interface MonthDetail {
    month: string;
    totalSales: number;
    totalProformas: number;
    ganancia: number;
    productosVendidos: number;
    productosProforma: number;
    numeroVentas: number;
    numeroProformas: number;
    ticketPromedioVentas: number;
    ticketPromedioProformas: number;
    conversionRate: number;
}

export default function BarChartInvoice({ sales, proformas }: BarChartInvoiceProps) {
    const [isDark, setIsDark] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<MonthDetail | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Detectar modo oscuro
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Procesar datos por mes
    const monthlyData = useMemo(() => {
        const salesData = sales.data?.content || [];
        const proformasData = proformas.data?.content || [];

        const monthsMap = new Map<string, MonthlyData>();

        // Función para obtener el mes en formato legible
        const getMonthYear = (dateString: string | null) => {
            if (!dateString) return 'Sin fecha';
            const date = new Date(dateString);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        };

        // Procesar ventas
        salesData.forEach(sale => {
            const monthKey = getMonthYear(sale.createAt);

            if (!monthsMap.has(monthKey)) {
                monthsMap.set(monthKey, {
                    month: monthKey,
                    sales: { total: 0, count: 0, products: 0, items: [] },
                    proformas: { total: 0, count: 0, products: 0, items: [] }
                });
            }

            const monthData = monthsMap.get(monthKey)!;
            monthData.sales.total += sale.total || 0;
            monthData.sales.count += 1;
            monthData.sales.products += sale.count_product || 0;
            monthData.sales.items.push(sale);
        });

        // Procesar proformas
        proformasData.forEach(proforma => {
            const monthKey = getMonthYear(proforma.createAt);

            if (!monthsMap.has(monthKey)) {
                monthsMap.set(monthKey, {
                    month: monthKey,
                    sales: { total: 0, count: 0, products: 0, items: [] },
                    proformas: { total: 0, count: 0, products: 0, items: [] }
                });
            }

            const monthData = monthsMap.get(monthKey)!;
            monthData.proformas.total += proforma.total || 0;
            monthData.proformas.count += 1;
            monthData.proformas.products += proforma.count_product || 0;
            monthData.proformas.items.push(proforma);
        });

        // Ordenar por fecha (más reciente primero) y tomar los últimos 6 meses
        const sortedData = Array.from(monthsMap.values()).sort((a, b) => {
            const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');

            if (yearA !== yearB) {
                return parseInt(yearA) - parseInt(yearB);
            }

            return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        }).slice(-6); // Últimos 6 meses

        return sortedData;
    }, [sales, proformas]);

    // Preparar datos para el gráfico
    const chartData = {
        labels: monthlyData.map(d => d.month),
        datasets: [
            {
                label: "Ventas",
                data: monthlyData.map(d => d.sales.total),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: "rgba(59, 130, 246, 0.9)",
            },
            {
                label: "Proformas",
                data: monthlyData.map(d => d.proformas.total),
                backgroundColor: "rgba(249, 115, 22, 0.8)",
                borderColor: "rgb(249, 115, 22)",
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: "rgba(249, 115, 22, 0.9)",
            },
        ],
    };

    // Opciones del gráfico con onClick
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: ChartEvent, elements: ActiveElement[]) => {
            if (elements.length > 0) {
                const dataIndex = elements[0].index;
                const monthData = monthlyData[dataIndex];

                if (monthData) {
                    const detail: MonthDetail = {
                        month: monthData.month,
                        totalSales: monthData.sales.total,
                        totalProformas: monthData.proformas.total,
                        ganancia: monthData.sales.total - (monthData.sales.total * 0.7), // Asumiendo 30% de margen
                        productosVendidos: monthData.sales.products,
                        productosProforma: monthData.proformas.products,
                        numeroVentas: monthData.sales.count,
                        numeroProformas: monthData.proformas.count,
                        ticketPromedioVentas: monthData.sales.count > 0 ? monthData.sales.total / monthData.sales.count : 0,
                        ticketPromedioProformas: monthData.proformas.count > 0 ? monthData.proformas.total / monthData.proformas.count : 0,
                        conversionRate: monthData.proformas.count > 0 ? (monthData.sales.count / monthData.proformas.count) * 100 : 0,
                    };

                    setSelectedMonth(detail);
                    setShowModal(true);
                }
            }
        },
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: isDark ? "#e2e8f0" : "#334155",
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: "500" as const
                    },
                    usePointStyle: true,
                    pointStyle: 'rectRounded' as const,
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Comparativa Mensual: Ventas vs Proformas',
                color: isDark ? "#f1f5f9" : "#1e293b",
                font: {
                    size: 18,
                    family: "'Inter', sans-serif",
                    weight: "600" as const
                },
                padding: {
                    bottom: 30
                }
            },
            tooltip: {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                titleColor: isDark ? "#f9fafb" : "#111827",
                bodyColor: isDark ? "#e5e7eb" : "#374151",
                borderColor: isDark ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${formatCurrency(value)}`;
                    },
                    afterLabel: function(context: any) {
                        const dataIndex = context.dataIndex;
                        const datasetIndex = context.datasetIndex;
                        const monthData = monthlyData[dataIndex];

                        if (datasetIndex === 0) { // Ventas
                            return [
                                `Cantidad: ${monthData.sales.count} ventas`,
                                `Productos: ${monthData.sales.products} unidades`
                            ];
                        } else { // Proformas
                            return [
                                `Cantidad: ${monthData.proformas.count} proformas`,
                                `Productos: ${monthData.proformas.products} unidades`
                            ];
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDark ? "#cbd5e1" : "#475569",
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                },
                grid: {
                    color: isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.5)",
                    lineWidth: 1,
                },
                border: {
                    color: isDark ? "#475569" : "#cbd5e1",
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? "#cbd5e1" : "#475569",
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    callback: function(value: any) {
                        return formatNumber(value);
                    }
                },
                grid: {
                    color: isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.5)",
                    lineWidth: 1,
                },
                border: {
                    color: isDark ? "#475569" : "#cbd5e1",
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart' as const,
        }
    };

    // Verificar si hay datos
    const hasData = monthlyData.length > 0;

    if (!hasData) {
        return (
            <div className="w-full text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Sin datos disponibles
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay ventas ni proformas registradas para mostrar en el gráfico
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {/* Instrucciones */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Haz clic en cualquier barra para ver los detalles del mes
                    </p>
                </div>

                {/* Gráfico */}
                <div className="h-96 w-full cursor-pointer">
                    <Bar data={chartData} options={options} />
                </div>

                {/* Resumen General */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Ventas</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {formatCurrency(monthlyData.reduce((sum, d) => sum + d.sales.total, 0))}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    {monthlyData.reduce((sum, d) => sum + d.sales.count, 0)} transacciones
                                </p>
                            </div>
                            <div className="text-blue-500 dark:text-blue-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Proformas</p>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                    {formatCurrency(monthlyData.reduce((sum, d) => sum + d.proformas.total, 0))}
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                    {monthlyData.reduce((sum, d) => sum + d.proformas.count, 0)} cotizaciones
                                </p>
                            </div>
                            <div className="text-orange-500 dark:text-orange-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Tasa de Conversión</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {(() => {
                                        const totalSales = monthlyData.reduce((sum, d) => sum + d.sales.count, 0);
                                        const totalProformas = monthlyData.reduce((sum, d) => sum + d.proformas.count, 0);
                                        const rate = totalProformas > 0 ? (totalSales / totalProformas) * 100 : 0;
                                        return `${rate.toFixed(1)}%`;
                                    })()}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Proformas convertidas en ventas
                                </p>
                            </div>
                            <div className="text-green-500 dark:text-green-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Detalles */}
            {showModal && selectedMonth && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Detalles de {selectedMonth.month}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Contenido del Modal */}
                        <div className="p-6">
                            {/* Métricas Principales */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Ventas del Mes</span>
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {formatCurrency(selectedMonth.totalSales)}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        {selectedMonth.numeroVentas} transacciones
                                    </p>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Proformas del Mes</span>
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                        {formatCurrency(selectedMonth.totalProformas)}
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        {selectedMonth.numeroProformas} cotizaciones
                                    </p>
                                </div>
                            </div>

                            {/* Detalles Adicionales */}
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Ganancia Estimada</span>
                                            <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                                {formatCurrency(selectedMonth.ganancia)}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                ~30% de margen sobre ventas
                                            </p>
                                        </div>
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Productos Vendidos</span>
                                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {selectedMonth.productosVendidos.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">unidades</p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Productos en Proforma</span>
                                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {selectedMonth.productosProforma.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">unidades</p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Promedio Ventas</span>
                                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {formatCurrency(selectedMonth.ticketPromedioVentas)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">por transacción</p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Promedio Proformas</span>
                                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {formatCurrency(selectedMonth.ticketPromedioProformas)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">por cotización</p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Tasa de Conversión</span>
                                            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                                {selectedMonth.conversionRate.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                                {selectedMonth.numeroVentas} de {selectedMonth.numeroProformas} proformas convertidas
                                            </p>
                                        </div>
                                        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Cerrar */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Helper para formatear números
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Helper para formatear valores monetarios
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount);
}
 `````