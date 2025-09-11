package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.common.ICrudController;
import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.dto.req.ProductReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProductDto;
import com.TiendaVirtual.proyecto.service.IProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController implements ICrudController<ProductReqDto, Long> {
    private IProductService productService;

    @Override
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        try {
            List<ProductDto> products = productService.findAll();
            return ResponseEntity.ok(Message.builder()
                    .message("Productos recuperados")
                    .success(true)
                    .data(products)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(e.getMessage());
        }
    }

    //@GetMapping("/paginated")
    @GetMapping
    public ResponseEntity<?> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ?
                    Sort.by(sortBy).descending() :
                    Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<ProductDto> products = productService.findAllPaginated(pageable);

            return ResponseEntity.ok(Message.builder()
                    .message("Productos recuperados con paginación")
                    .success(true)
                    .data(Map.of(
                            "content", products.getContent(),
                            "totalElements", products.getTotalElements(),
                            "totalPages", products.getTotalPages(),
                            "currentPage", products.getNumber(),
                            "size", products.getSize(),
                            "hasNext", products.hasNext(),
                            "hasPrevious", products.hasPrevious()
                    ))
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            // no se puede enviar Optional en la respuesta
            Optional<ProductDto> product = productService.findById(id);
            return ResponseEntity.ok(Message.builder()
                    .message(String.format("Producto recuperado con id: %s", id))
                    .success(true)
                    .data(product.get())
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<?> save(@RequestBody @Valid ProductReqDto dto) {
        try {
            ProductDto product = productService.save(dto);
            return ResponseEntity.ok(Message.builder()
                    .message(String.format("Producto creado con id: %s", product.getId()))
                    .success(true)
                    .data(product)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,@RequestBody @Valid ProductReqDto dto) {
        try {
            ProductDto product = productService.update(id, dto);
            return ResponseEntity.ok(Message.builder()
                    .message(MessageFormat.format("Producto actualizado con id: {0}", id))
                    .success(true)
                    .data(product)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            productService.delete(id);
            return ResponseEntity.ok(Message.builder()
                    .message("Producto eliminado "+ id + " correctamente" )
                    .success(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Message.builder()
                            .message(e.getMessage())
                            .success(false)
                            .build());
        }
    }
}
