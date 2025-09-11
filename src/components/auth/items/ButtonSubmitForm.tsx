"use client";

interface ButtonSubmitProps {
    pending: boolean;
    children?: React.ReactNode;
}

export default function ButtonSubmitForm({pending, children}: ButtonSubmitProps) {
    return (
        <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white
          rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            disabled={pending}
        >
            {children}
        </button>
    )
}
