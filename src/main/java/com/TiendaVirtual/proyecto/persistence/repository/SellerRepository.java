package com.TiendaVirtual.proyecto.persistence.repository;

import com.TiendaVirtual.proyecto.persistence.model.Seller;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends CrudRepository<Seller, Long> {
    Optional<Seller> findByCarnet(int carnet);
    Optional<Seller> findByUser_Username(String username);

    @Query("SELECT s FROM Seller s WHERE s.user.id = :userId")
    Optional<Seller> findByUserId(@Param("userId") Long userId);
}
