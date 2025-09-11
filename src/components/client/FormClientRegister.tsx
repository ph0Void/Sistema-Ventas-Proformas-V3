"use client";

import React, {useState} from 'react'
import {ClientSchema} from "@/schema/ClientSchema";
import {z} from "zod";
import {IdCard, Mail, Phone, User} from "lucide-react";
import {useClientStore} from "@/store/ClientStore";

export default function FormClientRegister() {
    const [formData, setFormData] = useState<z.infer<typeof ClientSchema>>({
        fullName: "",
        dni: undefined!,
        phone: undefined!,
        email: ""
    });

    const setFormDataClient = useClientStore(state => state.setClient);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;

        // Convertir valores numéricos
        let processedValue: string | number = value;
        if (name === 'dni' || name === 'phone') {
            processedValue = value ? parseInt(value, 10) : 0;
        }

        const updateData = {
            ...formData,
            [name]: processedValue,
        };

        // Actualizar el estado local
        setFormData(updateData);

        // Actualizar el estado global
        setFormDataClient(updateData);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold texto-primario mb-8">
                Información del Cliente
            </h2>
            <div className="gap-4" >
                {/* nombre completo   */}
                <div className="pb-4" >
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium texto-terciario mb-2"
                    >
                      <span className=" flex items-center">
                        <User className="mr-2 text-blue-500"/>
                          Nombre Completo
                          <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                      </span>
                    </label>
                    <input
                        type="text"
                        required
                        id="fullName"
                        name="fullName"
                        placeholder="Ingrese su nombre completo"
                        className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                {/* Correo   */}
                <div className="pb-4" >
                    <label
                        htmlFor="email"
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
                        type="email"
                        required
                        id="email"
                        name="email"
                        placeholder="Ingrese su nombre completo"
                        className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/*  dni  */}
                <div className="grid sm:grid-cols-2 gap-6 pb-4 " >
                    <div>
                        <label
                            htmlFor="identityType"
                            className="block text-sm font-medium texto-terciario mb-2"
                        >
                          <span className="flex items-center">
                            <IdCard size={30} className="mr-2 text-blue-500"/>
                              Identificador
                            <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                          </span>
                        </label>
                        <select
                            className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                            <option className="bg-slate-100 dark:bg-slate-800" >Seleccione tipo</option>
                            <option className="bg-slate-100 dark:bg-slate-800" >DNI</option>
                            <option className="bg-slate-100 dark:bg-slate-800" >Carnet de Extranjería</option>
                            <option className="bg-slate-100 dark:bg-slate-800" >Otro</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="dni"
                            className="block text-sm font-medium texto-terciario mb-2"
                        >
                          <span className="flex items-center">
                            <IdCard size={30} className="mr-2 text-blue-500"/>
                              N° Documento
                              <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                          </span>
                        </label>
                        <input
                            type="number"
                            id="dni"
                            name="dni"
                            placeholder="Ingrese número de documento"
                            className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.dni ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/*  numero de telefono  */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium texto-terciario mb-2"
                    >
                        <span className="flex items-center">
                          <Phone className="mr-2 text-blue-500" />
                            N° Teléfono
                            <span className="ml-1 font-light text-xs texto-cuaternario">
                              (Obligatorio)
                            </span>
                        </span>
                    </label>
                    <input
                        type="number"
                        id="phone"
                        name="phone"
                        placeholder="Ingrese número de teléfono"
                        className="texto-secundario w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.phone ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}
