"use client";

import React, {useEffect, useRef, useState} from 'react'
import {useRouter, useSearchParams} from "next/navigation";
import {X} from "lucide-react";


interface ModalBaseProps {
    classNameButton?: string;
    iconButton?: React.ReactNode;
    titleBtn?: string;

    // modal
    modalTitle?: string;
    children: React.ReactNode;
    buttonPersonalizado?: boolean;
}

export default function ModalBase({
                                      classNameButton,
                                      iconButton,
                                      titleBtn,
                                      modalTitle,
                                      children,
                                      buttonPersonalizado
                                  }: ModalBaseProps) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    // Detectar si la modal debe abrirse basado en la URL
    useEffect(() => {
        const shouldOpen = window.location.hash === "#add-expense";
        setOpen(shouldOpen);
    }, [searchParams]);

    const openModal = () => {
        setOpen(true);
        //router.push(`/dashboard/budgets/${budgetId}#add-expense`, { scroll: false });
    };

    const closeModal = () => {
        setOpen(false);
        //router.push(`/dashboard/budgets/${budgetId}`, { scroll: false });
    };

    // Cerrar con Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Evitar scroll del body cuando está abierta
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);


    return (
        <>
            {/*  boton de abrir modal */}
            <button
                onClick={openModal}
                className={`flex cursor-pointer mx-2  ${classNameButton}`}
            >
                {iconButton}
                {titleBtn}
            </button>
            {/*  overlay de la modal  */}

            {/* Overlay modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    aria-modal="true"
                    role="dialog"
                    onClick={closeModal}
                >
                    {/* Panel */}
                    <div
                        ref={panelRef}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/*  contenido de la modal  */}
                        <div>
                            {/* Encabezado de la modal */}
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                                <h2 className="text-xl sm:text-2xl font-bold texto-primario">
                                    {modalTitle}
                                </h2>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 texto-primary cursor-pointer"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="texto-primario" size={30}/>
                                </button>
                            </div>
                            {/* cuerpo de la modal */}
                            {children}

                            <div
                                className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/10">
                                {!buttonPersonalizado && (
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-200 hover:bg-gray-300 cursor-pointer
                                    rounded-lg px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-500 texto-primario"
                                    >
                                        Aceptar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
