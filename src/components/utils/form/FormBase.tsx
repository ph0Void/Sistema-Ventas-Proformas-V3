"use client";

import React from 'react'

interface FormBaseProps  {
    isModal?: boolean;
    title: string;
    btnText: string;
    pending: boolean;
    onClose: () => void;
    action: (formData: FormData) => void;
    children: React.ReactNode;
}

export default function FormBase({isModal = false, title, btnText, pending, action, onClose, children}: FormBaseProps) {

    return (
        <form action={action} noValidate  >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h2 className=" text-xl sm:text-2xl font-bold texto-primario">
                    {title}
                </h2>
                {isModal && (
                    <button
                        type="button" // evita submit accidental
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100
                    dark:hover:bg-white/10 texto-primary cursor-pointer"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/*  cuerpo del formulario  */}
            <div className="px-6 py-5" >
                <div className="grid gap-4" >
                    {children}
                </div>
            </div>

            {/*  footer  */}
            <div className="flex justify-end gap-4.5">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-slate-200 cursor-pointer dark:bg-slate-500 rounded-lg
                        hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-2 justify-center  "
                    disabled={pending}
                >
                    Cancelar
                </button>

                <button
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700
                    text-white px-4 py-2 rounded-lg shadow"
                    type="submit"
                    disabled={pending}
                >
                    {btnText}
                </button>
            </div>

        </form>
    )
}
