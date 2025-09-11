package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Long id;

    private String name;


    private List<ProductDto> products;

    public static CategoryDto toDto(Category entity){
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .products(entity.getProducts() == null ? List.of() :
                        entity.getProducts().stream()
                                .map(ProductDto::toDtoWithoutCategory) // Usar método sin categoría
                                .toList())
                .build();
    }

    public static CategoryDto toDtoWithoutProducts(Category entity){
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                //.products(null) // No incluir productos
                .build();
    }
}
