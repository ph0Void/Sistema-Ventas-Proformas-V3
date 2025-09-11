package com.TiendaVirtual.proyecto.persistence.repository;

import com.TiendaVirtual.proyecto.persistence.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findBySellerId(Long idSeller);
    Page<Sale> findBySellerId(Long idSeller, Pageable pageable);
}
