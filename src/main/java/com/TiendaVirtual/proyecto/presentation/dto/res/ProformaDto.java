package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Proforma;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProformaDto {
    private Long id;

    private double total;

    private LocalDateTime createAt;

    private List<OrderDetailDto> orderDetails = new ArrayList<>();

    private ClientDto client;

    @JsonProperty("count_product")
    private Double countProduct(){
        return orderDetails
                .stream()
                .mapToDouble(OrderDetailDto::getQuantity)
                .sum();
    }

    public static ProformaDto toDto(Proforma proforma){
        ProformaDto proformaDto = new ProformaDto();
        proformaDto.setId(proforma.getId());
        proformaDto.setTotal(proforma.getTotal());
        proformaDto.setCreateAt(proforma.getCreateAt());
        proformaDto.setClient(ClientDto.toDto(proforma.getClient()));
        proformaDto.setOrderDetails(
                proforma.getOrderDetails()
                        .stream()
                        .map(OrderDetailDto::toDto)
                        .toList()
        );
        return proformaDto;
    }
}