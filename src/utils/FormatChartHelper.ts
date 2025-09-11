// Helpers
export function formatMonthLabel(key: string) {
    const [y, m] = key.split("-").map(Number);
    const date = new Date(y, m - 1, 1);
    const fmt = new Intl.DateTimeFormat("es", {
        month: "short",
        year: "numeric",
    });
    let label = fmt.format(date);
    label = label.charAt(0).toUpperCase() + label.slice(1);
    return label.replace(".", ""); // Ene., Feb., etc. -> Ene, Feb, ...
}

export function formatCurrencyCOP(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(value);
}

export function formatCompact(value: number) {
    return new Intl.NumberFormat("es", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}