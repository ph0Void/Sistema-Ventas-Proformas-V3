"use client";

import React, {useState} from 'react'
import {CheckCircle, XCircle, AlertTriangle, Info} from "lucide-react";

interface ShowAlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
}

const StyleBase = {
    success: 'bg-green-50 border-green-500 dark:bg-green-900/20',
    error: 'bg-red-50 border-red-500 dark:bg-red-900/20',
    warning: 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20',
    info: 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
}

const StyleIconBase = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
}

const StyleTextBase = {
    success: {
        title: 'text-green-800 dark:text-green-200',
        message: 'text-green-700 dark:text-green-300'
    },
    error: {
        title: 'text-red-800 dark:text-red-200',
        message: 'text-red-700 dark:text-red-300'
    },
    warning: {
        title: 'text-yellow-800 dark:text-yellow-200',
        message: 'text-yellow-700 dark:text-yellow-300'
    },
    info: {
        title: 'text-blue-800 dark:text-blue-200',
        message: 'text-blue-700 dark:text-blue-300'
    }
}

const IconBase = {
    success: <CheckCircle size={20} className="text-white" />,
    error: <XCircle size={20} className="text-white" />,
    warning: <AlertTriangle size={20} className="text-white" />,
    info: <Info size={20} className="text-white" />
}

export default function ShowAlert({type = 'success', title = 'Success', message}: ShowAlertProps) {
    return (
        <div className={`flex w-full border-l-4 ${StyleBase[type]} rounded-md shadow-sm px-6 py-4`}>
            <div className="flex-shrink-0 mr-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${StyleIconBase[type]}`}>
                    {IconBase[type]}
                </div>
            </div>
            <div className="w-full">
                <h5 className={`mb-2 font-semibold ${StyleTextBase[type].title}`}>
                    {title}
                </h5>
                <p className={`leading-relaxed ${StyleTextBase[type].message}`}>
                    {message}
                </p>
            </div>
        </div>
    )
}
