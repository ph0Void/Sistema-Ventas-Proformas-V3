package com.TiendaVirtual.proyecto.service;

import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import com.TiendaVirtual.proyecto.presentation.dto.req.auth.UserReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.UserDto;

public interface IAuthService {
    UserDto sigInAndReturnJwt(UserReqDto signInRequest);

    /**
     * Inicio dession login
     * @return  retorna un token
     */
    String signInAuth(UserReqDto userDto);
    /**
     * Registro de usuario
     * @return retorna un token
     */
    String signUpAuth(UserReqDto userDto);
}