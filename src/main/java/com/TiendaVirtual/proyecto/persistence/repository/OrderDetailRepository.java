package com.TiendaVirtual.proyecto.persistence.repository;

import com.TiendaVirtual.proyecto.persistence.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
}
