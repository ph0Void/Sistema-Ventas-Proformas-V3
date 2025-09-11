package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.presentation.dto.req.SaleReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SaleDto;
import com.TiendaVirtual.proyecto.service.common.ICashOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ISaleService extends ICashOrderService<SaleReqDto, SaleDto, Long> {
    SaleDto getById(Long idOrder, Long idSeller);

    Page<SaleDto> getAllPaginated(Long idSeller, Pageable pageable);
}
