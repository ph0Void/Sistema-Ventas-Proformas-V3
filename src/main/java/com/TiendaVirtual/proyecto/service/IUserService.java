package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.presentation.dto.req.auth.UserReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.UserDto;
import com.TiendaVirtual.proyecto.service.common.ICrudService;

import java.util.Optional;

public interface IUserService extends ICrudService<UserDto, UserReqDto, Long> {
    Optional<UserDto> findByUsername(String username);

    void changeRole(Long userId, String role);
}
