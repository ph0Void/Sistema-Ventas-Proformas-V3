package com.TiendaVirtual.proyecto.presentation.dto.req.auth;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDto {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @Size(min = 4, message = "La contraseña debe tener al menos 4 caracteres")
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
