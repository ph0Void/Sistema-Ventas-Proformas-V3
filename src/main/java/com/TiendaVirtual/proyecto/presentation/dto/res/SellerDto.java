package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Seller;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDto {
    private String name;
    private String lastName;
    private int carnet;
    private String storeAddress;

    public static SellerDto toDto(Seller seller) {
        return new SellerDto(
                seller.getName(),
                seller.getLastName(),
                seller.getCarnet(),
                seller.getStoreAddress()
        );
    }
}
