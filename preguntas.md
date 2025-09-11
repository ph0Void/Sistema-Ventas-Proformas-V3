QUIERO CREAR UN GRAFICO DE (BARRAS , AREA , TU ELIGE ) CON LA LIBREIA DE  "chart.js": "^4.5.0",     "react-chartjs-2": "^5.3.0",

QUE ME PERMITA COMPAR LAS VENTAS VS LAS PROFORMAS DE UNA MANERA SENCILLA 
PARA ESO TENGO LOS SIGUIENTES DATOS
PUEDE SER QUE ME MUESTRE LAS VENTAS - PROFORMAS POR MES Y QUE CUANDO 
HAGA CLICK EN UNA BARRA ME MUESTRE LOS DETALLES DE ESE MES POR EJEMPLO 
EL TOTAL DE VENTAS Y PROFORMAS DE ESE MES , LA GANACIA , CANTIDAD DE PRODUCTOS VENDIDOS
Y CANTIDAD DE PRODUCTOS EN PROFORMA

AQUI TE DEJO LOS DATOS: 

// src/schema/ProformaSchema.ts
import { z } from "zod";
import {ClientSchema} from "@/schema/ClientSchema";
import {OrderDetailResponseSchema, OrderDetailSchema} from "@/schema/OrderDetailSchema";

/**
* Schema para las proformas.
  */
  export const ProformaSchema = z.object({
  id: z.number().optional(),
  total: z.number(),
  createAt: z.string().nullable(),
  orderDetails: z.array(OrderDetailResponseSchema),
  client: ClientSchema,
  count_product: z.number(),
  });

/**
* Schema para la solicitud de proforma.
* para crear o actualizar una nueva proforma.
* Incluye los datos del cliente y los detalles del pedido.
  */
  export const ProformaRequestSchema = z.object({
  client: ClientSchema,
  orderDetails: z.array(OrderDetailSchema),
  });

/**
* Schema para validar la respuesta de la API al crear o actualizar o eliminar una proforma.
* Incluye los campos: success, message, data (que contiene la proforma) y date.
  */
  export const ProformaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ProformaSchema.nullable(),
  date: z.string(),
  });

/**
* Schema para validar la respuesta de la API al obtener una lista de proformas.
* PARA OBTENER LAS PROFORMAS DE UN VENDEDOR
* Incluye los campos: success, message, data (que contiene un array de proformas) y date.
  */
  export const ProformaListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
  totalPages: z.number(),
  content: z.array(ProformaSchema),
  hasPrevious: z.boolean(),
  totalElements: z.number(),
  currentPage: z.number(),
  hasNext: z.boolean(),
  }),
  date: z.string(),
  });
  // src/schema/SaleSchema.ts

import { z } from "zod";
import {ClientSchema} from "@/schema/ClientSchema";
import {OrderDetailResponseSchema, OrderDetailSchema} from "@/schema/OrderDetailSchema";

/**
* Schema para las ventas.
  */
  export const SaleSchema = z.object({
  id: z.number().optional(),
  total: z.number(),
  createAt: z.string().nullable(),
  orderDetails: z.array(OrderDetailResponseSchema),
  client: ClientSchema, // Incluye los datos del cliente
  count_product: z.number(),
  });

/**
* Schema para la solicitud de venta.
* para crear o actualizar una nueva venta.
* Incluye los datos del cliente y los detalles del pedido.
  */
  export const SaleRequestSchema = z.object({
  client: ClientSchema,
  orderDetails: z.array(OrderDetailSchema),
  });

/**
* Schema para validar la respuesta de la API al crear o actualizar o eliminar una venta.
* Incluye los campos: success, message, data (que contiene la venta) y date.
  */
  export const SaleResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: SaleSchema.nullable(),
  date: z.string(),
  });

/**
* Schema para validar la respuesta de la API al obtener una lista de ventas.
* PARA OBTENER LAS VENTAS DE UN VENDEDOR
  */
  export const SaleListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
  totalPages: z.number(),
  content: z.array(SaleSchema),
  hasPrevious: z.boolean(),
  totalElements: z.number(),
  currentPage: z.number(),
  hasNext: z.boolean(),
  }),
  date: z.string(),
  });

// COMPOENTEN QUE ESTOY TRABAJANDO PERO NO ME SALE NADA

"use client";

import React, { useEffect, useState } from 'react';
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
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartInvoiceProps {
sales: z.infer<typeof SaleListResponseSchema>;
proformas: z.infer<typeof ProformaListResponseSchema>;
}

export default function BarChartInvoice({ sales, proformas }: BarChartInvoiceProps) {
// Detectar modo oscuro
const [isDark, setIsDark] = useState(false);
useEffect(() => {
const checkDarkMode = () => {
setIsDark(document.documentElement.classList.contains('dark'));
};
checkDarkMode();
const observer = new MutationObserver(checkDarkMode);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
return () => observer.disconnect();
}, []);

    // Calcular métricas de ventas y proformas
    const salesData = sales.data?.content || [];
    const proformasData = proformas.data?.content || [];

    const salesCount = salesData.length;
    const proformasCount = proformasData.length;

    const salesTotal = salesData.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const proformasTotal = proformasData.reduce((sum, proforma) => sum + (proforma.total || 0), 0);

    const salesProducts = salesData.reduce((sum, sale) => sum + (sale.count_product || 0), 0);
    const proformasProducts = proformasData.reduce((sum, proforma) => sum + (proforma.count_product || 0), 0);

    const data = {
        labels: ['Cantidad de Documentos', 'Valor Total (Miles)', 'Productos Vendidos'],
        datasets: [
            {
                label: "Ventas",
                data: [salesCount, Math.round(salesTotal / 1000), salesProducts],
                backgroundColor: "#3b82f6",
                borderColor: "#2563eb",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: "Proformas",
                data: [proformasCount, Math.round(proformasTotal / 1000), proformasProducts],
                backgroundColor: "#f97316",
                borderColor: "#ea580c",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: isDark ? "#e2e8f0" : "#334155",
                    font: {
                        size: 13,
                        family: "'Inter', sans-serif",
                        weight: "500"
                    },
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Comparativa: Ventas vs Proformas',
                color: isDark ? "#f1f5f9" : "#1e293b",
                font: {
                    size: 16,
                    family: "'Inter', sans-serif",
                    weight: "600"
                },
                padding: {
                    bottom: 20
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
                        const dataIndex = context.dataIndex;

                        if (dataIndex === 1) {
                            return `${label}: ${value}k (${value * 1000} total)`;
                        }
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDark ? "#cbd5e1" : "#475569",
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    maxRotation: 45,
                },
                grid: {
                    color: isDark ? "#334155" : "#e2e8f0",
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
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    stepSize: 1,
                },
                grid: {
                    color: isDark ? "#334155" : "#e2e8f0",
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
            easing: 'easeOutQuart',
        }
    };

    // Verificar si hay datos
    const hasData = salesCount > 0 || proformasCount > 0;

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
        <div className="w-full p-4">
            <div className="h-80 w-full">
                <Bar data={data} options={options} />
            </div>

            {/* Información adicional */}
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {salesCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total Ventas
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        ${salesTotal.toLocaleString()}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {proformasCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total Proformas
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        ${proformasTotal.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper para formatear números en gráficos
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
