package com.TiendaVirtual.proyecto.service.common;

import java.util.List;

/**
 * Interfaz genérica para servicios de gestión de órdenes de caja, como ventas y proformas.
 *
 * @param <E>  entidad de la SALE | PROFORMA
 * @param <D>  entidad de la SALE | PROFORMA  respuesta
 * @param <I>  id de la entidad y el id del vendedor
 */
public interface ICashOrderService <E, D , I > {

    D createOrder(E order, I idSeller);

    D updateOrder(I idOrder, E order, I idSeller);

    void deleteOrder(I idOrder, I idSeller);

    List<D> getAllOrdersBySeller(I idSeller);
}
