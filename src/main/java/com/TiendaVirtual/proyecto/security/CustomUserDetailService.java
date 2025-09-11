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
        logger.info("Loading user by username: {}", userDto);
        Set<GrantedAuthority> authorities;
        if (userDto.getRole() == null){
            logger.warn("No se pudo obtener el rol del usuario: {}", username);
            // Opción A: Asignar autoridades vacías (el usuario no tendrá roles)
            authorities = Collections.emptySet();
            // Opción B: Asignar un rol/autoridad por defecto (si aplica a tu lógica)
            // authorities = Set.of(new SimpleGrantedAuthority("ROLE_DEFAULT")); // O el rol que definas
        }else {
            // Si el rol no es nulo, crea la autoridad normalmente
            authorities = Set.of(SecurityUtils.converToAuthority(userDto.getRole()));
        }

        return UserPrincipal.builder()
                .id(userDto.getId())
                .username(userDto.getUsername())
                .password(userDto.getPassword()) // contraseña haseada de l abd
                .authorities(authorities)
                .user(UserDto.toEntity(userDto))
                .build();
    }
}
