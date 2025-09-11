import {CreditCard, DollarSign, FileText, Menu, Package, Settings, User} from 'lucide-react';
import {JSX} from "react";

interface NavLink {
    name: string;
    url: string;
    icon?:  JSX.Element;
}


export const routesMenu: NavLink[] = [
    {name: 'Productos', url: '/dashboard/product', icon: <Package size={30} />},
    {name: 'Ventas', url: '/dashboard/sale', icon: <CreditCard size={30} />},
    {name: 'Proformas', url: '/dashboard/proforma', icon: <FileText size={30} />},
];

export const routesTopMenu: NavLink[] = [
    {name: 'Ventas', url: '/dashboard/sale', icon: <CreditCard size={30} />},
    {name: 'Proformas', url: '/dashboard/proforma', icon: <FileText size={30} />},
];