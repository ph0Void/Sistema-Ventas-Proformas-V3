"use client";

import React, { useEffect } from 'react';
import { useUiStore } from "@/store/UIStore";
import { Moon, Sun } from "lucide-react";

export default function ToggleTheme() {
    const themeUI = useUiStore(state => state.theme);
    const changeTheme = useUiStore(state => state.changeTheme);

    // Sincroniza la clase 'dark' con el estado del store
    useEffect(() => {
        const html = document.documentElement;
        if (themeUI === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [themeUI]);

    const toggleThemeButton = () => {
        changeTheme();
    };

    return (
        <button
            onClick={toggleThemeButton}
            aria-label="Cambiar modo oscuro"
            className="h-10 w-10 rounded-lg p-2 hover:bg-gray-200
                    dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer "
        >
            <Sun className="text-gray-700 block dark:hidden" size={20} />
            <Moon className="fill-yellow-500 hidden dark:block" size={20} />
        </button>
    );
}