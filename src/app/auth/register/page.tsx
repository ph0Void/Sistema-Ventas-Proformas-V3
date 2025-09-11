import React from 'react'
import {UserPlus} from "lucide-react";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function PageAuthRegister() {
    return (
        <div>
            {/* encabezado */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <UserPlus className="w-10 h-10 text-red-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Crea tu cuenta
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Por favor, completa el formulario para registrarte.
                    </p>
                </div>
            </div>
            {/*  formulario de login    */}
            <div>
                <RegisterForm/>
            </div>

            {/*  footer redirecciones  */}
            <div className="mt-8" >
                <Link
                    href="/auth/login"
                    className="text-red-600 hover:underline"
                >
                    ¿Ya tienes una cuenta? Inicia sesión
                </Link>
            </div>
        </div>
    )
}
