package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.persistence.model.Seller;
import com.TiendaVirtual.proyecto.presentation.controller.common.ICashOrderController;
import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.controller.handler.UserHandler;
import com.TiendaVirtual.proyecto.presentation.dto.req.ProformaReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProformaDto;
import com.TiendaVirtual.proyecto.service.IProformaService;
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
@RequestMapping("/proforma")
@AllArgsConstructor
public class ProformaController implements ICashOrderController<ProformaReqDto, Long> {

    private final Logger logger = LoggerFactory.getLogger(ProformaController.class);
    private final IProformaService proformaService;
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

            ProformaDto proforma = proformaService.getById(idOrder, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Venta obtenida exitosamente")
                    .data(proforma)
                    .build();

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al obtener proforma {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al obtener proforma {}", idOrder, e);
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
            var proformas = proformaService.getAllPaginated(sellerId, pageable);

            return ResponseEntity.ok(Message.builder()
                    .success(true)
                    .message("Proformas obtenidas exitosamente")
                    .data(Map.of(
                            "content", proformas.getContent(),
                            "totalElements", proformas.getTotalElements(),
                            "totalPages", proformas.getTotalPages(),
                            "currentPage", proformas.getNumber(),
                            "hasPrevious", proformas.hasPrevious(),
                            "hasNext", proformas.hasNext()
                    ))
                    .build());

        } catch (Exception e) {
            logger.error("Error interno al obtener proformas", e);
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
            logger.info("Obteniendo proformas para vendedor: {}", sellerId);

            var proformas = proformaService.getAllOrdersBySeller(sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Proformas obtenidas exitosamente")
                    .data(proformas)
                    .build();

            logger.info("Proformas obtenidas: {} proformas", proformas.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error interno al obtener proformas", e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }



    @Override
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody @Valid ProformaReqDto order) {
        try {
            Long sellerId = getIdSellerUser();
            logger.info("Creando proforma para vendedor: {}", sellerId);

            ProformaDto createdProforma = proformaService.createOrder(order, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Proforma creada exitosamente")
                    .data(createdProforma)
                    .build();

            logger.info("Proforma creada con ID: {}", createdProforma.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al crear proforma: {}", e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al crear proforma", e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Override
    @PutMapping("/{idOrder}")
    public ResponseEntity<?> updateOrder(@PathVariable Long idOrder, @RequestBody @Valid ProformaReqDto order) {
        try {
            Long sellerId = getIdSellerUser();
            logger.info("Actualizando proforma {} para vendedor: {}", idOrder, sellerId);

            ProformaDto updatedProforma = proformaService.updateOrder(idOrder, order, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Proforma actualizada exitosamente")
                    .data(updatedProforma)
                    .build();

            logger.info("Proforma {} actualizada exitosamente", idOrder);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al actualizar proforma {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al actualizar proforma {}", idOrder, e);
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
            logger.info("Eliminando proforma {} para vendedor: {}", idOrder, sellerId);

            proformaService.deleteOrder(idOrder, sellerId);

            Message response = Message.builder()
                    .success(true)
                    .message("Proforma eliminada exitosamente")
                    .data(null)
                    .build();

            logger.info("Proforma {} eliminada exitosamente", idOrder);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al eliminar proforma {}: {}", idOrder, e.getMessage());
            Message errorResponse = Message.builder()
                    .success(false)
                    .message(e.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            logger.error("Error interno al eliminar proforma {}", idOrder, e);
            Message errorResponse = Message.builder()
                    .success(false)
                    .message("Error interno del servidor")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}