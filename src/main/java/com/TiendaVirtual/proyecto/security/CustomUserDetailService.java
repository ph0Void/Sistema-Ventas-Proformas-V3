package com.TiendaVirtual.proyecto.security;

import com.TiendaVirtual.proyecto.presentation.dto.res.UserDto;
import com.TiendaVirtual.proyecto.security.model.UserPrincipal;
import com.TiendaVirtual.proyecto.security.utils.SecurityUtils;
import com.TiendaVirtual.proyecto.service.IUserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
@AllArgsConstructor
public class CustomUserDetailService implements UserDetailsService{
    private final IUserService userService;
    private final Logger logger = LoggerFactory.getLogger(CustomUserDetailService.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDto userDto = userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con username: " + username));
        Set<GrantedAuthority> authorities;
        if (userDto.getRole() == null){
            logger.warn("No se pudo obtener el rol del usuario: {}", username);
            authorities = Collections.emptySet();
        }else {
            authorities = Set.of(SecurityUtils.converToAuthority(userDto.getRole()));
        }

        return UserPrincipal.builder()
                .id(userDto.getId())
                .username(userDto.getUsername())
                .password(userDto.getPassword()) 
                .authorities(authorities)
                .user(UserDto.toEntity(userDto))
                .build();
    }
}
