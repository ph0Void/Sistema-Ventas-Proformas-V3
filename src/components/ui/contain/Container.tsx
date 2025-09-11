import React from 'react'
import {LayoutProps} from "@/model/LayoutProps";

export default function Container({children}: LayoutProps) {
    return (
        <div
            className="rounded-sm  bg-slate-200 dark:bg-[#24303F]
             p-4 shadow-default
            md:p-6 xl:p-9"
        >
            {children}
        </div>
    )
}
