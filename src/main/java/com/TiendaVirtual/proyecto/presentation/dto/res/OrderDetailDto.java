package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDto {
    private Long id;

    private int quantity;
    private ProductDto product;

    public static OrderDetailDto toDto(OrderDetail orderDetail){
        OrderDetailDto orderDetailDto = new OrderDetailDto();
        orderDetailDto.setId(orderDetail.getId());
        orderDetailDto.setQuantity(orderDetail.getQuantity());
        orderDetailDto.setProduct(ProductDto.toDto(orderDetail.getProduct()));
        return orderDetailDto;
    }
}
