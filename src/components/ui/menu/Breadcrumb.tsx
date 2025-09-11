"use client";

import React from 'react'
import Link from "next/link";
import {usePathname} from "next/navigation";

interface BreadcrumbProps {
    pageName: string;
    children?: React.ReactNode;
}

export default function Breadcrumb({pageName, children}: BreadcrumbProps) {
    const pathName = usePathname();
    const segments = pathName.split('/').filter(Boolean);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="">
                <h2 className="texto-primario font-semibold text-4xl">
                    {pageName}
                </h2>
                <ol className="flex gap-2 text-xl">
                    <Link
                        className="font-semibold text-gray-800 dark:text-gray-500 hover:underline dark:hover:text-indigo-50"
                        href="/dashboard"
                    >
                        /Dashboard
                    </Link>
                    {segments.slice(1).map((item, i) => {
                        const href = '/' + segments.slice(0, i + 2).join('/');
                        return (
                            <Link
                                className="font-semibold text-gray-800 dark:text-gray-500 hover:underline dark:hover:text-indigo-50"
                                href={href}
                                key={item}
                            >
                                /{item[0].toUpperCase() + item.slice(1)}
                            </Link>
                        );
                    })}
                </ol>
            </nav>
            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    )
}