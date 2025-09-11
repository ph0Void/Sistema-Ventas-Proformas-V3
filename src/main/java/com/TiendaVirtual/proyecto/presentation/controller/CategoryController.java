package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.common.ICrudController;
import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.dto.req.CategoryReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.CategoryDto;
import com.TiendaVirtual.proyecto.service.ICategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController implements ICrudController<CategoryReqDto, Long> {

    private ICategoryService categoryService;

    @Override
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(Message.builder()
                    .message("Categorias recuperadas")
                    .success(true)
                    .data(categoryService.findAll())
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message("Error al recuperar categorias")
                            .success(false)
                            .build());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(Message.builder().
                    message("Categoria recuperada")
                    .success(true)
                    .data(categoryService.findById(id))
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(String.format("Error al recuperar categoria con id: %s", id))
                            .success(false)
                            .build());
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<?> save(@RequestBody @Valid CategoryReqDto dto) {
        try {
            CategoryDto category = categoryService.save(dto);
            return ResponseEntity.ok(Message.builder()
                    .message(String.format("Categoria creada con id: %s", category.getName()))
                    .success(true)
                    .data(category)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message("Error al crear categoria")
                            .success(false)
                            .build());
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,@RequestBody @Valid CategoryReqDto dto) {
        try {
            CategoryDto category = categoryService.update(id, dto);
            return ResponseEntity.ok(Message.builder()
                    .message(String.format("Categoria actualizada con id: %s", category.getName()))
                    .success(true)
                    .data(category)
                    .build());
        }catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(String.format("Error al actualizar categoria con id: %s", id))
                            .success(false)
                            .build());
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(Message.builder()
                    .message("Categoria eliminada "+ id + " correctamente" )
                    .success(true)
                    .build());
        }catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(String.format("Error al eliminar categoria con id: %s", id))
                            .success(false)
                            .build());
        }
    }
}