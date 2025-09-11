"use client";

import React, {useActionState, useEffect, useState} from 'react'
import {useRouter} from "next/navigation";
import {RegisterAction} from "@/action/AuthAction";
import {CreateInitialActionState} from "@/model/ActionState";
import {toast} from "sonner";
import {User} from "lucide-react";
import ErrorMessage from "@/components/utils/alert/ErrorMessage";
import ShowPassword from "@/components/auth/items/ShowPassword";
import ButtonSubmitForm from "@/components/auth/items/ButtonSubmitForm";
import {RegisterSchema} from "@/schema/AuthSchema";
import ShowAlert from "@/components/utils/alert/ShowAlert";

export default function RegisterForm() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        RegisterAction,
        CreateInitialActionState<typeof RegisterSchema>()
    );
    const [showPassword, setShowPassword] = useState(false);

    // Toast de error
    useEffect(() => {
        if (!pending && state.message && !state.success) {
            toast.error(state.message);
        }
    }, [pending, state.message, state.success]);

    // Toast de éxito + redirect
    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            const id = setTimeout(() => {
                router.push("/auth/login");
            }, 500);
            return () => clearTimeout(id);
        }
    }, [state.success, state.message, router]);


    return (
        <form action={formAction} className="space-y-6" noValidate>

            {state.message && !state.success &&(
                <ShowAlert
                    type="error"
                    message={state.message}
                    title={"Error al crear la cuenta"}
                />
            )}

            {/* nombre de usuario */}
            <div className="mb-6" >
                <label
                    htmlFor="username"
                    className="label-form"
                >
                    Nombre de usuario
                </label>
                <div className="relative" >
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="user01"
                        className={`input-form ${state.fieldErrors?.username ? "border-red-600 focus:border-red-600 focus:ring-red-600" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                        disabled={pending}
                    />
                    <User className="absolute right-3 top-4 w-5 h-5 text-gray-400" />
                </div>
                {state.fieldErrors?.username?.map((error, i) => (
                    <ErrorMessage key={i} message={error} />
                ))}
            </div>

            {/*constraseña */}
            <div className="mb-6" >
                <label
                    htmlFor="password"
                    className="label-form"
                >
                    Contraseña
                </label>
                <div className="relative" >
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        className={`input-form ${state.fieldErrors?.password ? "border-red-600 focus:border-red-600 focus:ring-red-600" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                    />
                    <ShowPassword
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                </div>
                {state.fieldErrors?.password?.map((error, i) => (
                    <ErrorMessage key={i} message={error} />
                ))}
            </div>

            {/* repetir contraseña */}
            <div className="mb-6" >
                <label
                    htmlFor="confirmPassword"
                    className="label-form"
                >
                    Contraseña
                </label>
                <div className="relative" >
                    <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className={`input-form ${state.fieldErrors?.confirmPassword ? "border-red-600 focus:border-red-600 focus:ring-red-600" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                    />
                    <ShowPassword
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                </div>
                {state.fieldErrors?.password?.map((error, i) => (
                    <ErrorMessage key={i} message={error} />
                ))}
            </div>

            <ButtonSubmitForm pending={pending}>
                {pending ? "Creando cuenta..." : "Crear Cuenta"}
            </ButtonSubmitForm>
        </form>
    )
}