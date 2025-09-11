package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.presentation.dto.req.ProformaReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProformaDto;
import com.TiendaVirtual.proyecto.service.common.ICashOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProformaService extends ICashOrderService<ProformaReqDto, ProformaDto, Long> {
    ProformaDto getById(Long idProforma, Long idSeller);
    Page<ProformaDto> getAllPaginated(Long idSeller, Pageable pageable);
}
