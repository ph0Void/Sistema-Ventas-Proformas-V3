package com.TiendaVirtual.proyecto.service;


import com.TiendaVirtual.proyecto.persistence.model.Seller;
import com.TiendaVirtual.proyecto.presentation.dto.req.SellerReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SellerDto;

import java.util.List;
import java.util.Optional;

public interface ISellerService{

    List<SellerDto> findAll();

    Optional<SellerDto> findById(Long id);

    SellerDto save(SellerReqDto dto, Long userId);

    SellerDto update(Long idSeller, SellerReqDto dto);

    void delete(Long id);

    Optional<Seller> findByUserId(Long userId);
}
