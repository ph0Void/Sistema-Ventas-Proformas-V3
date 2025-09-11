package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Sale;
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
public class SaleDto {
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

    public static SaleDto toDto(Sale sale){
        SaleDto saleDto = new SaleDto();
        saleDto.setId(sale.getId());
        saleDto.setTotal(sale.getTotal());
        saleDto.setCreateAt(sale.getCreateAt());
        saleDto.setClient(ClientDto.toDto(sale.getClient()));
        saleDto.setOrderDetails(
                sale.getOrderDetails()
                        .stream()
                        .map(OrderDetailDto::toDto)
                        .toList()
        );
        return saleDto;
    }
}
