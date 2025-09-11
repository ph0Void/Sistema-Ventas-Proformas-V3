import React from 'react'
import {LayoutProps} from "@/model/LayoutProps";

export default function ItemError({children}:LayoutProps) {
    return (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md" >
            {children}
        </div>
    )
}
