package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private Long id;

    private String name;

    private String urlImage;

    private String description;

    private Double price;

    private Integer stock;

    private CategoryDto category;

    public static ProductDto toDto(Product entity){
        return ProductDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .urlImage(entity.getUrlImage())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stock(entity.getStock())
                .category(CategoryDto.toDtoWithoutProducts(entity.getCategory()))
                .build();
    }
    public static ProductDto toDtoWithoutCategory(Product entity){
        return ProductDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .urlImage(entity.getUrlImage())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stock(entity.getStock())
                .category(null) // No incluir la categoría para evitar recursión
                .build();
    }
}
