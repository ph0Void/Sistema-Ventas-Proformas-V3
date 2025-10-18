package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.persistence.model.Seller;
import com.TiendaVirtual.proyecto.presentation.controller.common.ICashOrderController;
import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.controller.handler.UserHandler;
import com.TiendaVirtual.proyecto.presentation.dto.req.SaleReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SaleDto;
import com.TiendaVirtual.proyecto.service.ISaleService;
import com.TiendaVirtual.proyecto.service.ISellerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sale")
@AllArgsConstructor
public class SaleController implements ICashOrderController<SaleReqDto, Long> {

    private final Logger logger = LoggerFactory.getLogger(SaleController.class);
    private final ISaleService saleService;
    private final ISellerService sellerService;

    private final UserHandler userHandler;

    private Long getIdSellerUser(){
        Long userId = userHandler.getCurrentUserId();
        Seller user = sellerService.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No existe vendedor asociado al usuario con id: " + userId));
        return user.getId();
    }

    @GetMapping("/{idOrder}")
    public ResponseEntity<?> getById(@PathVariable Long idOrder) {
        try {
            Long sellerId = getIdSellerUser();

            SaleDto sale = saleService.getById(idOrder, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Venta obtenida exitosamente")
                    .data(sale)
                    .build();

            logger.info("Venta obtenida: {}", sale);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al obtener venta {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al obtener venta {}", idOrder, e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        try{
            Long sellerId = getIdSellerUser();
            Pageable pageable = PageRequest.of(page, size);
            var sales = saleService.getAllPaginated(sellerId, pageable);

            return ResponseEntity.ok(Message.builder()
                    .success(true)
                    .message("Ventas obtenidas exitosamente")
                    .data(Map.of(
                            "content", sales.getContent(),
                            "totalElements", sales.getTotalElements(),
                            "totalPages", sales.getTotalPages(),
                            "currentPage", sales.getNumber(),
                            "hasPrevious", sales.hasPrevious(),
                            "hasNext", sales.hasNext()
                    ))
                    .build());

        } catch (Exception e) {
            logger.error("Error interno al obtener ventas", e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrdersBySeller() {
        try {
            Long sellerId = getIdSellerUser();
            logger.info("Obteniendo ventas para vendedor: {}", sellerId);

            var sales = saleService.getAllOrdersBySeller(sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Ventas obtenidas exitosamente")
                    .data(sales)
                    .build();

            logger.info("Ventas obtenidas: {} ventas", sales.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error interno al obtener ventas", e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody @Valid SaleReqDto order) {
        try {
            Long sellerId = getIdSellerUser();

            logger.info("Creando venta para vendedor: {}", sellerId);

            SaleDto createdSale = saleService.createOrder(order, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Venta creada exitosamente")
                    .data(createdSale)
                    .build();

            logger.info("Venta creada con ID: {}", createdSale.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al crear venta: {}", e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al crear venta", e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @Override
    @PutMapping("/{idOrder}")
    public ResponseEntity<?> updateOrder(@PathVariable Long idOrder, @RequestBody @Valid SaleReqDto order) {
        try {
            Long sellerId = getIdSellerUser();
            logger.info("Actualizando venta {} para vendedor: {}", idOrder, sellerId);

            SaleDto updatedSale = saleService.updateOrder(idOrder, order, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Venta actualizada exitosamente")
                    .data(updatedSale)
                    .build();

            logger.info("Venta {} actualizada exitosamente", idOrder);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al actualizar venta {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al actualizar venta {}", idOrder, e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Override
    @DeleteMapping("/{idOrder}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long idOrder) {
        try {
            Long sellerId = getIdSellerUser();
            logger.info("Eliminando venta {} para vendedor: {}", idOrder, sellerId);

            saleService.deleteOrder(idOrder, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Venta eliminada exitosamente")
                    .data(null)
                    .build();

            logger.info("Venta {} eliminada exitosamente", idOrder);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al eliminar venta {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al eliminar venta {}", idOrder, e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
