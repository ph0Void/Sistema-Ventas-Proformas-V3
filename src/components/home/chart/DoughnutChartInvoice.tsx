"use client";

import React, {useEffect, useState} from 'react';
import {SaleListResponseSchema} from "@/schema/SaleSchema";
import {ProformaListResponseSchema} from "@/schema/ProformaSchema";
import {z} from "zod";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#3b82f6', '#f97316'];

interface DoughnutChartInvoiceProps {
    sales: z.infer<typeof SaleListResponseSchema>;
    proformas: z.infer<typeof ProformaListResponseSchema>;
}

export default function DoughnutChartInvoice({proformas, sales}: DoughnutChartInvoiceProps) {

    // Detectar modo oscuro
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Observar cambios en el modo oscuro
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Estadísticas de ventas y proformas
    const totalSales = sales.data.totalElements;
    const totalProformas = proformas.data.totalElements;
    const total = totalSales + totalProformas;

    const data = {
        labels: ['Ventas', 'Proformas'],
        datasets: [
            {
                label: "Comparación",
                data: [totalSales, totalProformas],
                backgroundColor: COLORS,
                borderColor: isDark ? ['#1e293b', '#1e293b'] : ['#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: isDark ? "#e2e8f0" : "#334155",
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                titleColor: isDark ? "#f9fafb" : "#111827",
                bodyColor: isDark ? "#e5e7eb" : "#374151",
                borderColor: isDark ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                callbacks: {
                    label: function(context: import("chart.js").TooltipItem<"doughnut">) {
                        const label = context.label || "";
                        const value = context.parsed || 0;
                        const percentage = total === 0 ? 0 : ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: true,
        aspectRatio: 1.2
    };

    // Mostrar mensaje si no hay datos
    if (total === 0) {
        return (
            <div className="w-full max-w-xs mx-auto text-center p-6">
                <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                </div>
                <p className="texto-tertiary text-sm">Sin ventas ni proformas para mostrar</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xs mx-auto">
            <Doughnut data={data} options={options} />

            {/* Información adicional */}
            <div className="mt-4 text-center space-y-1">
                <p className="texto-terciario text-xs">
                    Ventas: <span className="font-semibold">{totalSales}</span> | Proformas: <span className="font-semibold">{totalProformas}</span>
                </p>
                <p className="texto-primario text-sm font-medium">
                    Total: {total}
                </p>
            </div>
        </div>
    )
}
