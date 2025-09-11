package com.TiendaVirtual.proyecto.persistence.repository;

import com.TiendaVirtual.proyecto.persistence.model.Proforma;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProformaRepository extends JpaRepository<Proforma, Long> {
    List<Proforma> findBySellerId(Long idSeller);
    Page<Proforma> findBySellerId(Long idSeller, Pageable pageable);
}
