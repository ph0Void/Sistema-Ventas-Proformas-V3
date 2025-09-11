package com.TiendaVirtual.proyecto.security.utils;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class SecurityUtils {
    public static final String ROLE_PREFIX = "ROLE_";

    public static SimpleGrantedAuthority converToAuthority(String role) {
        if (role == null || role.trim().isEmpty()) {
            return new SimpleGrantedAuthority(ROLE_PREFIX + "ANONYMOUS");
        }
        String formatRole = role.startsWith(ROLE_PREFIX) ? role : ROLE_PREFIX + role;
        return new SimpleGrantedAuthority(formatRole);
    }

    public static Set<GrantedAuthority> convertToAuthorities(List<String> roles) {
        return roles.stream()
                .map(role -> converToAuthority(role))
                .collect(Collectors.toSet());
    }
}
