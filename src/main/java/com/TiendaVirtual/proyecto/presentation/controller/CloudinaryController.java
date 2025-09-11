package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.service.ICloudinaryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/images")
@CrossOrigin(origins = "*")
public class CloudinaryController {
    private final ICloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Message.builder()
                                .message("No se ha seleccionado archivo")
                                .success(false)
                                .build());
            }

            String imageUrl = cloudinaryService.uploadImage(file);

            return ResponseEntity.ok(Message.builder()
                    .message("Imagen subida exitosamente")
                    .success(true)
                    .data(Map.of("url", imageUrl))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Message.builder()
                            .message("Error al subir imagen: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }
}
