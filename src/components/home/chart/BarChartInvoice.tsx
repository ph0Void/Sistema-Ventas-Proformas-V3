"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { SaleListResponseSchema } from "@/schema/SaleSchema";
import { ProformaListResponseSchema } from "@/schema/ProformaSchema";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {formatCompact, formatCurrencyCOP, formatMonthLabel} from "@/utils/FormatChartHelper";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type SaleListResponse = z.infer<typeof SaleListResponseSchema>;
type ProformaListResponse = z.infer<typeof ProformaListResponseSchema>;

interface Props {
    sales: SaleListResponse;
    proformas: ProformaListResponse;
    months?: number; // por defecto 12
}

type Metric = "amount" | "count" | "products";

type MonthRow = {
    key: string;
    label: string;
    salesTotal: number;
    salesCount: number;
    salesProducts: number;
    proformasTotal: number;
    proformasCount: number;
    proformasProducts: number;
};

export default function BarChartInvoiceByMonth({
                                                   sales,
                                                   proformas,
                                                   months = 12,
                                               }: Props) {
    const chartRef = useRef<any>(null);
    const [metric, setMetric] = useState<Metric>("amount");
    const [isDark, setIsDark] = useState(false);
    const [selected, setSelected] = useState<MonthRow | null>(null);

    // Detecta modo oscuro (Tailwind `dark`)
    useEffect(() => {
        const check = () =>
            setIsDark(document.documentElement.classList.contains("dark"));
        check();
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => obs.disconnect();
    }, []);

    const salesData = sales?.data?.content ?? [];
    const proformasData = proformas?.data?.content ?? [];

    // Agrega por mes (últimos N meses). Rellena meses sin datos con 0.
    const monthRows: MonthRow[] = useMemo(() => {
        const now = new Date();
        const keys: string[] = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            keys.push(key);
        }

        const base: Record<string, MonthRow> = {};
        keys.forEach((k) => {
            base[k] = {
                key: k,
                label: formatMonthLabel(k),
                salesTotal: 0,
                salesCount: 0,
                salesProducts: 0,
                proformasTotal: 0,
                proformasCount: 0,
                proformasProducts: 0,
            };
        });

        for (const s of salesData) {
            if (!s.createAt) continue;
            const d = new Date(s.createAt);
            if (isNaN(d.getTime())) continue;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            if (!base[key]) continue; // fuera del rango de meses
            base[key].salesTotal += s.total ?? 0;
            base[key].salesCount += 1;
            base[key].salesProducts += s.count_product ?? 0;
        }

        for (const p of proformasData) {
            if (!p.createAt) continue;
            const d = new Date(p.createAt);
            if (isNaN(d.getTime())) continue;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            if (!base[key]) continue; // fuera del rango de meses
            base[key].proformasTotal += p.total ?? 0;
            base[key].proformasCount += 1;
            base[key].proformasProducts += p.count_product ?? 0;
        }

        return keys.map((k) => base[k]);
    }, [salesData, proformasData, months]);

    const labels = monthRows.map((r) => r.label);

    const valuesFor = (type: "sales" | "proformas") => {
        if (metric === "amount") {
            return monthRows.map((r) =>
                type === "sales" ? r.salesTotal : r.proformasTotal
            );
        }
        if (metric === "count") {
            return monthRows.map((r) =>
                type === "sales" ? r.salesCount : r.proformasCount
            );
        }
        return monthRows.map((r) =>
            type === "sales" ? r.salesProducts : r.proformasProducts
        );
    };

    const data: ChartData<"bar"> = {
        labels,
        datasets: [
            {
                label: "Ventas",
                data: valuesFor("sales"),
                backgroundColor: "#3b82f6",
                borderColor: "#2563eb",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: "Proformas",
                data: valuesFor("proformas"),
                backgroundColor: "#f97316",
                borderColor: "#ea580c",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements, chart) => {
            // Si se clickea una barra, obtiene su índice y setea el detalle
            if (elements && elements.length > 0) {
                const index = elements[0].index;
                setSelected(monthRows[index]);
            } else {
                // fallback, por si elements llega vacío
                const instance = chartRef.current;
                const points =
                    instance?.getElementsAtEventForMode?.(
                        evt,
                        "index",
                        { intersect: true },
                        false
                    ) || [];
                if (points.length) {
                    setSelected(monthRows[points[0].index]);
                }
            }
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: isDark ? "#e2e8f0" : "#334155",
                    font: { size: 13, family: "'Inter', sans-serif", weight: "bold" },
                    usePointStyle: true,
                    pointStyle: "rectRounded",
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: "Ventas vs Proformas por mes",
                color: isDark ? "#f1f5f9" : "#1e293b",
                font: { size: 16, family: "'Inter', sans-serif", weight: "bold" },
                padding: { bottom: 20 },
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
                    label: (ctx) => {
                        const value = ctx.parsed.y as number;
                        const label = ctx.dataset.label || "";
                        if (metric === "amount") return `${label}: ${formatCurrencyCOP(value)}`;
                        return `${label}: ${value.toLocaleString("es")}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: isDark ? "#cbd5e1" : "#475569",
                    font: { size: 11, family: "'Inter', sans-serif" },
                    maxRotation: 0,
                },
                grid: { color: isDark ? "#334155" : "#e2e8f0", lineWidth: 1 },
                border: { color: isDark ? "#475569" : "#cbd5e1" },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? "#cbd5e1" : "#475569",
                    font: { size: 11, family: "'Inter', sans-serif" },
                    callback: (val) => {
                        const v = Number(val);
                        if (metric === "amount") return formatCompact(v);
                        return v.toLocaleString("es");
                    },
                },
                grid: { color: isDark ? "#334155" : "#e2e8f0", lineWidth: 1 },
                border: { color: isDark ? "#475569" : "#cbd5e1" },
            },
        },
        interaction: { intersect: false, mode: "index" },
        animation: { duration: 700, easing: "easeOutQuart" },
    };

    const hasData = monthRows.some(
        (r) => r.salesCount + r.proformasCount > 0
    );

    return (
        <div className="w-full p-4">
            {/* Selector de métrica */}
            <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Métrica:</span>
                <div className="inline-flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setMetric("amount")}
                        className={`px-3 py-1.5 text-sm ${
                            metric === "amount"
                                ? "bg-blue-600 text-white"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        Montos
                    </button>
                    <button
                        onClick={() => setMetric("count")}
                        className={`px-3 py-1.5 text-sm border-l border-gray-200 dark:border-gray-700 ${
                            metric === "count"
                                ? "bg-blue-600 text-white"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        Facturas Emitidas
                    </button>
                    <button
                        onClick={() => setMetric("products")}
                        className={`px-3 py-1.5 text-sm border-l border-gray-200 dark:border-gray-700 ${
                            metric === "products"
                                ? "bg-blue-600 text-white"
                                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        Productos Vendidos
                    </button>
                </div>
            </div>

            {/* Gráfico */}
            <div className="h-80 w-full">
                {hasData ? (
                    <Bar ref={chartRef} data={data} options={options} />
                ) : (
                    <EmptyState />
                )}
            </div>

        </div>
    );
}


function EmptyState() {
    return (
        <div className="w-full text-center p-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
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

