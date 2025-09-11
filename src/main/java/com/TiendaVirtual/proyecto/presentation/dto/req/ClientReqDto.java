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
@NoArgsConstructor
@AllArgsConstructor
public class ClientReqDto {
    @NotBlank(message = "El nombre es obligatorio")
    private String fullName;

    @NotNull(message = "El dni es obligatorio")
    @Min(value = 10000000, message = "El dni debe tener al menos 8 digitos")
    private Integer dni;

    @NotNull(message = "El número de teléfono es obligatorio")
    private Integer phone;

    @NotBlank(message = "El email es obligatorio")
    private String email;
}
