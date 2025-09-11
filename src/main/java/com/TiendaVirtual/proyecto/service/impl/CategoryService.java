package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.presentation.dto.req.CategoryReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.CategoryDto;
import com.TiendaVirtual.proyecto.persistence.model.Category;
import com.TiendaVirtual.proyecto.persistence.repository.CategoryRepository;
import com.TiendaVirtual.proyecto.service.ICategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService implements ICategoryService {
    private CategoryRepository categoryRepository;

    @Override
    public List<CategoryDto> findAll() {
        List<CategoryDto> dtos = new ArrayList<>();
        categoryRepository.findAll().forEach(category -> {
            dtos.add(CategoryDto.toDto(category));
        });
        return dtos;
    }

    @Override
    public Optional<CategoryDto> findById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if(!category.isPresent()){
            throw new IllegalArgumentException("No existe categoria con id: " + id);
        }
        return Optional.of(CategoryDto.toDto(category.get()));
    }

    @Override
    @Transactional
    public CategoryDto save(CategoryReqDto dto) {
        Optional<Category> category = categoryRepository.findByName(dto.getName());
        if(category.isPresent()){
            throw new IllegalArgumentException("Ya existe una categoria con el nombre: " + dto.getName());
        }
        Category newCategory = new Category();
        newCategory.setName(dto.getName());
        return CategoryDto.toDto(this.categoryRepository.save(newCategory));
    }

    @Override
    @Transactional
    public CategoryDto update(Long id, CategoryReqDto dto) {
        Optional<Category> category = categoryRepository.findById(id);
        if (!category.isPresent()) {
            throw new IllegalArgumentException("No existe categoria con id: " + id);
        }
        category.get().setName(dto.getName());
        return CategoryDto.toDto(this.categoryRepository.save(category.get()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (!category.isPresent()) {
            throw new IllegalArgumentException("No existe categoria con id: " + id);
        }
        this.categoryRepository.delete(category.get());
    }
}
