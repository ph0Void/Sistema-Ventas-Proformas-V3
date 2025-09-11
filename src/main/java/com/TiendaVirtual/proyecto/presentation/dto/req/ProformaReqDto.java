package com.TiendaVirtual.proyecto.presentation.dto.req;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProformaReqDto {
    @NotNull(message = "Los datos del cliente son obligatorios")
    @Valid
    private ClientReqDto client;

    @NotNull(message = "Los detalles de la orden son obligatorios")
    @Valid
    @Size(min = 1, message = "Debe haber al menos un detalle en la orden")
    private List<OrderDetailReqDto> orderDetails = new ArrayList<>();
}
