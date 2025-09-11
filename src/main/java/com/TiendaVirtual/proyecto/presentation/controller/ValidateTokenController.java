package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.controller.handler.UserHandler;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/validate-token")
@RestController
@AllArgsConstructor
public class ValidateTokenController {

    private final static Logger logger = LoggerFactory.getLogger(ValidateTokenController.class);
    private final UserHandler userHandler;

    @PostMapping
    public ResponseEntity<?> validateTokenUser(){
        boolean isValid = userHandler.isCurrentTokenValid();
        if (!isValid){
            logger.warn("Token JWT inválido o expirado");
            return ResponseEntity.status(401).body("Token inválido o expirado");
        }
        return ResponseEntity.ok(Message.builder()
                .success(true)
                .message("Token válido")
                .data(Map.of("tokenValid", isValid))
                .build()
        );
    }
}
