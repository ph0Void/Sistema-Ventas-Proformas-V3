import React from 'react'
import Breadcrumb from "@/components/ui/menu/Breadcrumb";
import {SellerService} from "@/service/SellerService";
import FormProfile from "@/components/profile/FormProfile";

export default async function PageProfileSeller() {
    const response = await SellerService.getSeller();
    const hasSeller = response.success && response.data;

    return (
        <div>
            <Breadcrumb pageName={'Perfil'} />

            <div>
                <FormProfile
                    seller={hasSeller ? response.data : null}
                    isCreating={!hasSeller}
                />
            </div>
        </div>
    )
}