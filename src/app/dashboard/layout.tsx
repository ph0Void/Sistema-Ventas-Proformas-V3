import React from 'react'
import {LayoutProps} from "@/model/LayoutProps";
import TopMenu from "@/components/ui/menu/TopMenu";
import SideBar from "@/components/ui/menu/Sidebar";
import {ValidateTokenForUser} from "@/service/helper/ValidateTokenService";
import {redirect} from "next/navigation";

export default async function LayoutDashboard({children}: LayoutProps) {
    const auth = await ValidateTokenForUser();
    if (!auth.isValid){
        redirect('/auth/login');
    }
    return (
        <main>
            {/*menu superior */}
            <TopMenu/>
            <SideBar/>
            <div className="min-h-screen overflow-hidden w-full p-8 bg-gray-100
            dark:bg-[#1C2434] transition-colors">
                {children}
            </div>
        </main>
    )
}
