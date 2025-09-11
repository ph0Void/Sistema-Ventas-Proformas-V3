import React from 'react'
import {UserRound} from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = {
    title: 'Login - Auth',
    description: 'Página de login',
}

export default function PageAuthLogin() {
    return (
        <div>
            {/* encabezado */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <UserRound className="w-10 h-10 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        ¡Bienvenido de nuevo!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Por favor, inicia sesión para continuar.
                    </p>
                </div>
            </div>
            {/*  formulario de login    */}
            <div>
                <LoginForm/>
            </div>

            {/*  footer redirecciones  */}
            <div className="mt-8" >
                <Link
                    href="/auth/register"
                    className="text-red-600 hover:underline"
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
            </div>
        </div>
    )
}
