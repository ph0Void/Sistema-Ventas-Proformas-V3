"use client";

import React from 'react'

interface CardBlobbProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    footer: string;
    classname?: string;
}

export default function CardBlobb({icon, title, value, footer, classname}: CardBlobbProps) {
    return (
        <div className={`
      relative w-full transform cursor-pointer 
    flex-col gap-4 rounded-xl border  p-6 overflow-hidden
      shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105
      border-white/20 bg-white/10 dark:bg-gray-800/20
      hover:bg-white/20 dark:hover:bg-gray-700/30
      ${classname || ''}
    `}>

            {/* subtle overlay to adjust blob brightness in dark mode */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/20 mix-blend-overlay" />

            {/* content */}
            <div className="relative z-10 flex-1 flex flex-col justify-between">

                <div className="flex gap-2 items-center justify-between mb-4">
                    <div className="p-3 texto-secundario rounded-lg bg-white/20 backdrop-blur-sm">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="texto-primario text-sm sm:text-3xl  font-medium">
                            {title}
                        </h3>
                        <p className="texto-secundario text-xl sm:text-2xl  font-bold">
                            {value}
                        </p>
                    </div>
                </div>
                <div className="texto-terciario text-xs sm:text-xl ">
                    {footer}
                </div>
            </div>
        </div>
    )
}
