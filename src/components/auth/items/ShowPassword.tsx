"use client";

import React, {useState} from 'react'
import {Eye, EyeOff} from "lucide-react";

interface ShowPasswordProps {
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 *  Componente para mostrar/ocultar la contraseña
 *
 * @param show
 * @constructor
 */
export default function ShowPassword({showPassword, setShowPassword}: ShowPasswordProps) {

    return (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer right-3 top-4 text-gray-400 hover:text-gray-600"
        >
            {showPassword ? (
                <EyeOff className="w-5 h-5" />
            ) : (
                <Eye className="w-5 h-5" />
            )}
        </button>
    )
}
