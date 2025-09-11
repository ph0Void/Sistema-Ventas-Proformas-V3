"use client";

import React, {useActionState, useEffect} from 'react'
import {CreateSellerAction} from "@/action/SellerAction";
import {CreateInitialActionState} from "@/model/ActionState";
import {SellerSchema} from "@/schema/SellerSchema";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {z} from "zod";
import FormBase from "@/components/utils/form/FormBase";
import {IdCard, Mail, Phone, User} from "lucide-react";
import ErrorMessage from "@/components/utils/alert/ErrorMessage";

interface FormProfileProps {
    seller: z.infer<typeof SellerSchema> | null;
    isCreating?: boolean;
}

export default function FormProfile({seller, isCreating = false}: FormProfileProps) {
    const router = useRouter();

    const [state, formAction, pending] = useActionState(
        CreateSellerAction,
        CreateInitialActionState<typeof SellerSchema>()
    )

    // Toast de error
    useEffect(() => {
        if (!pending && state.message && !state.success) {
            toast.error(state.message);
        }
    }, [pending, state.message, state.success]);

    // Éxito
    useEffect(() => {
        if (state.success) {
            const message = isCreating ? "Vendedor creado exitosamente" : "Vendedor actualizado exitosamente";
            toast.success(state.message ?? message);
            const id = setTimeout(() => {
                router.refresh();
            }, 400);
            return () => clearTimeout(id);
        }
    }, [state.success, state.message, router, isCreating]);

    const handleFormAction = (formData: FormData) => {
        formAction(formData);
    }

    const title = isCreating ? "Crear Perfil de Vendedor" : "Perfil del Vendedor";
    const btnText = pending
        ? (isCreating ? "Creando..." : "Actualizando...")
        : (isCreating ? "Crear" : "Actualizar");

    return (
        <FormBase
            title={title}
            btnText={btnText}
            pending={pending}
            onClose={()=> router.refresh()}
            action={handleFormAction}
        >
            <div className="grid gap-6">
                {/* resto del contenido igual */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium texto-terciario mb-2"
                        >
                          <span className="flex items-center">
                            <User className="mr-2 text-blue-500"/>
                              Nombre
                            <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                          </span>
                        </label>
                        <input
                            className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            name="name"
                            id="name"
                            placeholder="Ingrese su nombre"
                            disabled={pending}
                            defaultValue={seller?.name}
                            type="text"
                        />
                        {state.fieldErrors?.name?.map((error, i) => (
                            <ErrorMessage key={i} message={error} />
                        ))}
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium texto-terciario mb-2"
                        >
                          <span className="flex items-center">
                              <User className="mr-2 text-blue-500"/>
                                Apellido
                              <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                          </span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Ingrese su apellido"
                            disabled={pending}
                            defaultValue={seller?.lastName}
                            className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {state.fieldErrors?.lastName?.map((error, i) => (
                            <ErrorMessage key={i} message={error} />
                        ))}
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="carnet"
                        className="block text-sm font-medium texto-terciario mb-2"
                    >
                      <span className="flex items-center">
                        <IdCard size={30} className="mr-2 text-blue-500"/>
                          Carnet de Identidad
                          <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                      </span>
                    </label>
                    <input
                        type="text"
                        required
                        id="carnet"
                        name="carnet"
                        placeholder="Ingrese su carnet de identidad"
                        defaultValue={seller?.carnet}
                        disabled={pending}
                        className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {state.fieldErrors?.carnet?.map((error, i) => (
                        <ErrorMessage key={i} message={error} />
                    ))}
                </div>
                <div>
                    <label
                        htmlFor="storeAddress"
                        className="block text-sm font-medium texto-terciario mb-2"
                    >
                      <span className="flex items-center">
                        <Mail className="mr-2 text-blue-500"/>
                          Direccion de Correo
                          <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                      </span>
                    </label>
                    <input
                        type="text"
                        required
                        id="storeAddress"
                        name="storeAddress"
                        placeholder="Ingrese la dirección de la tienda"
                        className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        defaultValue={seller?.storeAddress}
                        disabled={pending}
                    />
                    {state.fieldErrors?.storeAddress?.map((error, i) => (
                        <ErrorMessage key={i} message={error} />
                    ))}
                </div>
            </div>
        </FormBase>
    )
}