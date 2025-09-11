"use client";

import React from 'react'
import {LogOut, Search, Settings, User, X} from "lucide-react";
import Link from "next/link";
import {useUiStore} from "@/store/UIStore";
import {LogoutAction} from "@/action/AuthAction";
import {routesMenu} from "@/components/ui/menu/RoutesMenu";

export default function SideBar() {
    const isSidebarOpen = useUiStore(state => state.isMenuOpen);
    const closeMenu = useUiStore(state => state.closeMenu);

    // Evita cerrar al hacer clic dentro del nav
    const handleNavClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const onClickLogout = async () => {
        await LogoutAction();
    };

    return (
        <>
            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60"
                    onClick={closeMenu}
                />
            )}

            {/* Sidebar */}
            <nav
                className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 
                    transform transition-transform duration-300 ease-in-out 
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={handleNavClick}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Menú</h2>
                    <button
                        onClick={closeMenu}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors
                                   focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 cursor-pointer"
                        aria-label="Cerrar menú"
                    >
                        <X size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Navegación */}
                <div className="px-5">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Navegación
                    </h3>
                    <ul className="space-y-2">
                        {routesMenu.map((route, index) => (
                            <li key={index}>
                                <Link
                                    href={route.url}
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group
                                               text-gray-700 dark:text-gray-200
                                               hover:bg-gray-100 dark:hover:bg-gray-800
                                               hover:text-gray-900 dark:hover:text-white"
                                >
                                    <span className="flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                        {route.icon}
                                    </span>
                                    <span className="font-medium">{route.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Separador */}
                <div className="mx-5 my-6 border-t border-gray-200 dark:border-gray-800" />

                {/* Sección adicional */}
                <div className="px-5">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Configuración
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/dashboard/profile"
                                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors group cursor-pointer
                                           text-gray-700 dark:text-gray-200
                                           hover:bg-gray-100 dark:hover:bg-gray-800
                                           hover:text-gray-900 dark:hover:text-white"
                            >
                                <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                                    <User size={20} />
                                </span>
                                <span className="font-medium">
                                    Perfil
                                </span>
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors group cursor-pointer
                                           text-red-600 dark:text-red-400
                                           hover:bg-red-50 dark:hover:bg-red-900/20
                                           hover:text-red-700 dark:hover:text-red-300"
                                onClick={onClickLogout}
                            >
                                <span className="text-red-500 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
                                    <LogOut size={20} />
                                </span>
                                <span className="font-medium">
                                    Cerrar sesión
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>© {new Date().getFullYear()} Sistema de Ventas y Proformas </p>
                    </div>
                </div>
            </nav>
        </>
    )
}