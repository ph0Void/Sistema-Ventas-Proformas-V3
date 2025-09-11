package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.presentation.dto.req.ProductReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProductDto;
import com.TiendaVirtual.proyecto.persistence.model.Category;
import com.TiendaVirtual.proyecto.persistence.model.Product;
import com.TiendaVirtual.proyecto.persistence.repository.CategoryRepository;
import com.TiendaVirtual.proyecto.persistence.repository.ProductRepository;
import com.TiendaVirtual.proyecto.service.IProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService implements IProductService {
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;

    @Override
    public List<ProductDto> findAll() {
        List<Product> products = new ArrayList<>();
        productRepository.findAll().forEach(products::add);
        return products.stream().map(ProductDto::toDto).toList();
    }

    @Override
    public Page<ProductDto> findAllPaginated(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ProductDto::toDto);
    }

    @Override
    public Optional<ProductDto> findById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if(!product.isPresent()){
            throw new IllegalArgumentException("No existe producto con id: " + id);
        }
        return Optional.of(ProductDto.toDto(product.get()));
    }

    @Override
    @Transactional
    public ProductDto save(ProductReqDto dto) {
        Optional<Category> categoryOp = categoryRepository.findByName(dto.getCategory().getName());
        Category category  ;
        if (!categoryOp.isPresent()) {
            category = new Category();
            category.setName(dto.getCategory().getName());
            category = categoryRepository.save(category);
        }else {
            category = categoryOp.get();
        }

        Product newProduct = new Product();
        newProduct.setName(dto.getName());
        newProduct.setUrlImage(dto.getUrlImage());
        newProduct.setDescription(dto.getDescription());
        newProduct.setPrice(dto.getPrice());
        newProduct.setStock(dto.getStock());
        newProduct.setCategory(category);
        return ProductDto.toDto(this.productRepository.save(newProduct));
    }

    @Override
    @Transactional
    public ProductDto update(Long id, ProductReqDto dto) {

        Optional<Product> product = productRepository.findById(id);

        if (!product.isPresent()) {
            throw new IllegalArgumentException("No existe producto con id: " + id);
        }

        product.get().setName(dto.getName());
        product.get().setDescription(dto.getDescription());
        product.get().setPrice(dto.getPrice());
        product.get().setStock(dto.getStock());
        product.get().setUrlImage(dto.getUrlImage());

        // Actualizar categoría si es diferente
        if (dto.getCategory() != null && dto.getCategory().getName() != null) {
            Optional<Category> categoryOp = categoryRepository.findByName(dto.getCategory().getName());
            Category category;
            if (!categoryOp.isPresent()) {
                category = new Category();
                category.setName(dto.getCategory().getName());
                category = categoryRepository.save(category);
            } else {
                category = categoryOp.get();
            }
            product.get().setCategory(category);
        }
        return ProductDto.toDto(this.productRepository.save(product.get()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Product> product = productRepository.findById(id);

        if (!product.isPresent()) {
            throw new IllegalArgumentException("No existe producto con id: " + id);
        }
        this.productRepository.delete(product.get());
    }
}
