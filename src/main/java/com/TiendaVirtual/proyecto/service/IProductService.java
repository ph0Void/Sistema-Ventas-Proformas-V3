package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.presentation.dto.req.ProductReqDto;
import com.TiendaVirtual.proyecto.service.common.ICrudService;
import com.TiendaVirtual.proyecto.presentation.dto.res.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService extends ICrudService<ProductDto, ProductReqDto, Long> {
    Page<ProductDto> findAllPaginated(Pageable pageable);
}
