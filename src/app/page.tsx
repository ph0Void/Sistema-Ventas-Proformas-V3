import React from 'react'
import {redirect} from "next/navigation";

export default function Page() {
    redirect('/auth/login');
    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Welcome to the Home Page
            </h1>
            <p>This is the main landing page of the application.</p>
        </div>
    )
}
