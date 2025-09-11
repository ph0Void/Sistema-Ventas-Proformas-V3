"use client";

import React from 'react'
import {LayoutProps} from "@/model/LayoutProps";
import {usePathname} from "next/navigation";

export default function LayoutAuth({children}: LayoutProps) {
    const pathName = usePathname();

    return (
        <main>
            <div className="min-h-screen bg-gray-100">
                <div className="min-h-screen flex">
                    {/* lado izquierdo - Formulario de autenticación */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            {/* Contenedor del formulario */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                {children}
                            </div>
                        </div>
                    </div>

                    {/* lado derecho - Imagen */}
                    <div
                        className="hidden lg:block lg:w-1/2 bg-cover bg-center
                    bg-[url('/auth.jpg')] "
                    >
                        <div className="h-full   bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white px-12">
                                <h2 className="text-6xl font-bold mb-6 shadow-xl">
                                    {pathName === '/auth/login' ? ' - INICIAR SESIÓN' : ' - REGISTRARSE'}
                                </h2>
                                <p className="text-xl">

                                    {pathName === '/auth/login' ? ' Inicia sesión para continuar.' : ' Crea una cuenta para comenzar.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
