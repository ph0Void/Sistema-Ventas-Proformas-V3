import React from 'react'

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    className?: string;
}

export default function ButtonPrimary({children, className, ...rest}: ButtonPrimaryProps) {
    return (
        <button
            className={`cursor-pointer bg-indigo-500 hover:bg-indigo-600
                        dark:bg-indigo-600 dark:hover:bg-indigo-700
                       shadow-xl rounded-xl text-white font-medium py-2 px-4
                       transition duration-150 ease-in-out flex items-center gap-2 ${className} `}
            {...rest}
        >
            {children}
        </button>
    )
}
