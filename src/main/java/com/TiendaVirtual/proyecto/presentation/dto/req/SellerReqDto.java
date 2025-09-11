package com.TiendaVirtual.proyecto.presentation.dto.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerReqDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName;

    @NotNull(message = "El dni es obligatorio")
    @Min(value = 10000000, message = "El dni debe tener al menos 8 digitos")
    private Integer carnet;

    @NotBlank(message = "La dirección de la tienda es obligatoria")
    private String storeAddress;
}
