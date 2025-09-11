import React from 'react'
import {LayoutProps} from "@/model/LayoutProps";

export default function ContainItem({children}: LayoutProps) {
    return (
        <div
            className="rounded-sm  bg-white dark:bg-[#24303F]
            dark:border-stroke-2 p-4 shadow-default
            md:p-6 xl:p-9"
        >
            {children}
        </div>
    )
}
