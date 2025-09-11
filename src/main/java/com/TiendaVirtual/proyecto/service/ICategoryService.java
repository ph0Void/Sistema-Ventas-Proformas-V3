package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.presentation.dto.req.CategoryReqDto;
import com.TiendaVirtual.proyecto.service.common.ICrudService;
import com.TiendaVirtual.proyecto.presentation.dto.res.CategoryDto;

public interface ICategoryService extends ICrudService<CategoryDto, CategoryReqDto, Long> {
}
