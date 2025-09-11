// src/utils/FormatHelper.ts

/**
 * Formatea una fecha a un formato legible.
 * @param value Fecha en formato string o Date
 * @param locale Localización (por defecto 'es-PE')
 * @param options Opciones de formato (por defecto { dateStyle: 'medium', timeStyle: 'short' })
 * @returns Fecha formateada o '—' si el valor es inválido
 * @example formatDate(data.createAt) → "6 sept 2025, 10:57"
 */
export const formatDate = (
    value: string | Date | undefined | null,
    locale: string = 'es-PE',
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }
): string => {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return '—';
    try {
        return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
        return date.toLocaleString(locale);
    }
};

/**
 * Formatea un número como moneda.
 * @param value Número o string a formatear
 * @param locale
 * @param currency Código de moneda (por defecto 'PEN' para Sol Peruano)
 * @returns Valor formateado como moneda o '—' si el valor es inválido
 * @example formatMoney(1234.5) → "S/ 1,234.50"
 */
export const formatMoney = (
    value: number | string | undefined | null,
    locale: string = 'es-PE',
    currency: string = 'PEN'
): string => {
    if (value === undefined || value === null || value === '') return '—';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '—';
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    } catch {
        return `S/ ${num.toFixed(2)}`;
    }
};
