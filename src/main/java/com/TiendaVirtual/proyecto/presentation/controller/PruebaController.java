package com.TiendaVirtual.proyecto.presentation.controller;

import com.TiendaVirtual.proyecto.presentation.controller.handler.UserHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/prueba")
@AllArgsConstructor
public class PruebaController {

    private UserHandler userHandler;
    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     * {
     "status": "success",
     "message": "Datos recuperados",
     "data": [
     {
     "id": 1,
     "name": "Laptop"
     }
     ]
     }
     * */
    @GetMapping("/custom-json")
    public ResponseEntity<?> createCustomJson() {
        try {
            ObjectNode response = objectMapper.createObjectNode();
            response.put("status", "success");
            response.put("message", "Datos recuperados");

            ArrayNode products = objectMapper.createArrayNode();
            ObjectNode product = objectMapper.createObjectNode();
            product.put("id", 1);
            product.put("name", "Laptop");
            products.add(product);

            response.set("data", products);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/user-jwt")
    public ResponseEntity<?> anotherMethod() {
        String userInfo = userHandler.getUserInfo();
        return ResponseEntity.ok("{\"info\":\"" + userInfo + "\"}");
    }
}
