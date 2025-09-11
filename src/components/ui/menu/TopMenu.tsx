"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {Home, Menu} from "lucide-react";
import {useUiStore} from "@/store/UIStore";
import {routesMenu, routesTopMenu} from "@/components/ui/menu/RoutesMenu";
import ToggleTheme from "@/components/ui/ToggleTheme";

export default function TopMenu() {
    // abre el sidebar
    const openMenu = useUiStore(state => state.openMenu);

    const [loaded, setLoaded] = useState(false);
    useEffect(()=> {
        setLoaded(true);
    }, [])

    return (
        <nav className="flex px-5 py-3 items-center justify-between w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            {/* home */}
            <div>
                <Link className="flex gap-2 items-center" href={'/dashboard'}>
                    <Home size={40} className="text-gray-700 dark:text-gray-300" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        Home
                    </span>
                </Link>
            </div>

            {/*  contenedor central y botón menú  */}
            <div className="flex items-center gap-4">
                {/*  links para pantallas grandes */}
                <div className="hidden md:flex items-center gap-2">
                    {routesTopMenu.map((route, index) => (
                        <Link
                            key={index}
                            href={route.url}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <span className="flex-shrink-0 [&>*]:text-gray-600 dark:[&>*]:text-gray-300">
                                {route.icon}
                            </span>
                            <span className="text-sm font-medium">
                                {route.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* botón para cambiar el tema */}
                <div>
                    <ToggleTheme/>
                </div>

                {/* botón menú */}
                <button
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md transition-all
                               hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none
                               focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700
                               border border-gray-200 dark:border-gray-700"
                    onClick={()=>openMenu()}
                >
                    <Menu className="text-gray-600 dark:text-gray-300" size={30} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Menu</span>
                </button>
            </div>
        </nav>
    )
}