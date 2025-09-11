package com.TiendaVirtual.proyecto.presentation.controller.common;

import org.springframework.http.ResponseEntity;

/**
 * para poder hacer las ordenes de cuando
 * @param <E> Order
 * @param <I> Id Order
 */
public interface ICashOrderController <E, I>{

    ResponseEntity<?> getAllOrdersBySeller();

    ResponseEntity<?> createOrder(E order);

    ResponseEntity<?> updateOrder(I idOrder, E order);

    ResponseEntity<?> deleteOrder(I idOrder);
}
