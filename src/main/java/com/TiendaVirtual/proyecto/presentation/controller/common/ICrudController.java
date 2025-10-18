package com.TiendaVirtual.proyecto.presentation.controller.common;

import org.springframework.http.ResponseEntity;

public interface ICrudController<D, I> {

    default ResponseEntity<?> save(D dto) {
        return ResponseEntity.status(501).body("No implementado");
    }

    default ResponseEntity<?> update(I id, D dto) {
        return ResponseEntity.status(501).body("No implementado");
    }

    default ResponseEntity<?> delete(I id) {
        return ResponseEntity.status(501).body("No implementado");
    }

    default ResponseEntity<?> getAll() {
        return ResponseEntity.status(501).body("No implementado");
    }

    default ResponseEntity<?> getById(I id) {
        return ResponseEntity.status(501).body("No implementado");
    }
}
