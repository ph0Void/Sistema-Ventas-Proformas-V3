import React from 'react'
import ToggleTheme from "@/components/ui/ToggleTheme";
import ShowAlert from "@/components/utils/alert/ShowAlert";

export default function Page() {
    return (
        <div className="dark:bg-gray-800" >
            <ToggleTheme/>

            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 items-center" >
                Prueba de alertas
            </h1>
            <div className="space-y-4 items-center" >
                <ShowAlert
                    type="success"
                    title="Success"
                    message="This is a success alert message."
                />
                <ShowAlert
                    type="error"
                    title="Error"
                    message="This is an error alert message."
                />
                <ShowAlert
                    type="warning"
                    title="Warning"
                    message="This is a warning alert message."
                />
                <ShowAlert
                    type="info"
                    title="Info"
                    message="This is an info alert message."
                />
            </div>
        </div>
    )
}
