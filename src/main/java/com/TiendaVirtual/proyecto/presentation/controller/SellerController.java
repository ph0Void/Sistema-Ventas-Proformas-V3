package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.common.ICrudController;
import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.controller.handler.UserHandler;
import com.TiendaVirtual.proyecto.presentation.dto.req.SellerReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SellerDto;
import com.TiendaVirtual.proyecto.security.model.UserPrincipal;
import com.TiendaVirtual.proyecto.service.ISellerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seller")
@AllArgsConstructor
public class SellerController implements ICrudController<SellerReqDto, Long> {

    private final ISellerService sellerService;
    private final UserHandler userHandler;

    @Override
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        List<SellerDto> sellerDtos = sellerService.findAll();
        return ResponseEntity.ok(Message.builder()
                .message("Vendedores recuperados")
                .success(true)
                .data(sellerDtos)
                .build());
    }

    @GetMapping("/by-user")
    public ResponseEntity<?> getSellerByUser(){
        try{
            UserPrincipal currentUser = userHandler.getUserAuthenticated();
            return sellerService.findByUserId(currentUser.getId())
                    .map(sellerDto -> ResponseEntity.ok(Message.builder()
                            .message("Vendedor recuperado")
                            .success(true)
                            .data(sellerDto)
                            .build()))
                    .orElseGet(() -> ResponseEntity.status(404).body(Message.builder()
                            .message("No se encontró un vendedor para el usuario autenticado")
                            .success(false)
                            .data(null)
                            .build()));
        }catch (Exception e){
            return ResponseEntity.status(500).body(Message.builder()
                    .message("NO se encontró un vendedor para el usuario autenticado, error interno del servidor")
                    .success(false)
                    .data(null)
                    .build());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return sellerService.findById(id)
                .map(sellerDto -> ResponseEntity.ok(Message.builder()
                        .message("Vendedor recuperado")
                        .success(true)
                        .data(sellerDto)
                        .build()))
                .orElseGet(() -> ResponseEntity.status(404).body(Message.builder()
                        .message("No se encontró un vendedor con el ID proporcionado")
                        .success(false)
                        .data(null)
                        .build()));
    }

    @Override
    @PostMapping
    public ResponseEntity<?> save(@RequestBody @Valid SellerReqDto dto) {
        try{
            UserPrincipal currentUser = userHandler.getUserAuthenticated();
            SellerDto savedSeller = sellerService.save(dto, currentUser.getId());
            return ResponseEntity.status(201).body(Message.builder()
                    .message("Vendedor creado exitosamente")
                    .success(true)
                    .data(savedSeller)
                    .build());
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(Message.builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build());
        } catch (Exception e){
            return ResponseEntity.status(500).body(Message.builder()
                    .message("Error interno del servidor")
                    .success(false)
                    .data(null)
                    .build());
        }
    }

    // el id lo puedo traer del token asi qu corregir
    @Override
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,@RequestBody @Valid SellerReqDto dto) {
        try{
            SellerDto updatedSeller = sellerService.update(id, dto);
            return ResponseEntity.ok(Message.builder()
                    .message("Vendedor actualizado exitosamente")
                    .success(true)
                    .data(updatedSeller)
                    .build());
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(Message.builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build());
        } catch (Exception e){
            return ResponseEntity.status(500).body(Message.builder()
                    .message("Error interno del servidor")
                    .success(false)
                    .data(null)
                    .build());
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try{
            sellerService.delete(id);
            return ResponseEntity.ok(Message.builder()
                    .message("Vendedor eliminado exitosamente")
                    .success(true)
                    .data(null)
                    .build());
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(Message.builder()
                    .message(e.getMessage())
                    .success(false)
                    .data(null)
                    .build());
        } catch (Exception e){
            return ResponseEntity.status(500).body(Message.builder()
                    .message("Error interno del servidor")
                    .success(false)
                    .data(null)
                    .build());
        }
    }
}