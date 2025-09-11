package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.handler.Message;
import com.TiendaVirtual.proyecto.presentation.dto.req.auth.UserReqDto;
import com.TiendaVirtual.proyecto.service.IAuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final IAuthService authService;
    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Operation(summary = "Iniciar sesión", description = "Autentica a un usuario y retorna un JWT")
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody @Valid UserReqDto userReqDto){
        try{
            logger.info("USER DATA DE LOGIN : {}", userReqDto);
            String jwtUser = authService.signInAuth(userReqDto);
            if (jwtUser == null){
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Message.builder()
                                .success(false)
                                .message("Login incorrecto, verifique sus datos ")
                                .build());
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Message.builder()
                            .success(true)
                            .message("Login exitoso, bienvenido")
                            .data(Map.of("token", jwtUser))
                            .build());
        }catch (Exception e){
            logger.warn("Error al iniciar sesion: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Message.builder()
                            .success(false)
                            .message("Login incorrecto " + e.getMessage())
                            .build());
        }
    }

    @Operation(summary = "Registrar usuario", description = "Crea un nuevo usuario y retorna un JWT")
    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody @Valid UserReqDto userReqDto){
        try{
            logger.info("USER DATA DE REGISTRO : {}", userReqDto);
            String jwtUser = authService.signUpAuth(userReqDto);
            if (jwtUser == null){
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Message.builder()
                                .success(false)
                                .message("El usuario ya existe")
                                .build());
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Message.builder()
                            .success(true)
                            .message("Usuario registrado exitosamente")
                            .data(Map.of("token", jwtUser))
                            .build());
        }catch (Exception e){
            logger.warn("Error al registrar usuario: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Message.builder()
                            .success(false)
                            .message("Error al registrar usuario: " + e.getMessage())
                            .build());
        }
    }
}
