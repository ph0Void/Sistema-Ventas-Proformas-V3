import React from "react";
import {Ban} from "lucide-react";

interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <p className="text-sm pt-2 text-red-600 mt-1 flex items-center gap-2">
            <span>
                <Ban size={20}/>
            </span>
            {message}
        </p>
    )
}
