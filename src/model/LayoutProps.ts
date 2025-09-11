import React from "react";

/**
 * Props para componentes Layout que reciben children
 */
export interface LayoutProps {
    children: React.ReactNode;
}

/**
 * USAR EN LAYOUTS ASÍNCRONOS NEXT 15
 * Usar en componentes asíncronos que reciben parámetros
 */
export interface ParamIdProps {
    params: Promise<{ id: string }>;
}