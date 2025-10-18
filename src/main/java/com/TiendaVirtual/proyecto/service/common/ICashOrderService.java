package com.TiendaVirtual.proyecto.service.common;

import java.util.List;

public interface ICashOrderService <E, D , I > {

    D createOrder(E order, I idSeller);

    D updateOrder(I idOrder, E order, I idSeller);

    void deleteOrder(I idOrder, I idSeller);

    List<D> getAllOrdersBySeller(I idSeller);
}
