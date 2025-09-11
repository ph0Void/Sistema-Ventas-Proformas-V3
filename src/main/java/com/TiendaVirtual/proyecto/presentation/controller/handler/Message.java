package com.TiendaVirtual.proyecto.presentation.controller.handler;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Clase que representa un mensaje de respuesta estándar para las API.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private Boolean success;
    private String message;
    private Object data;

   @Builder.Default
   private LocalDateTime date = LocalDateTime.now();
//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
}
