package com.TiendaVirtual.proyecto.presentation.controller.handler;

import com.TiendaVirtual.proyecto.security.jwt.IJwtProvider;
import com.TiendaVirtual.proyecto.security.model.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@AllArgsConstructor
public class UserHandler {

    private final Logger logger = LoggerFactory.getLogger(UserHandler.class);
    private final IJwtProvider jwtProvider;

    public UserPrincipal getUserAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Usuario no autenticado");
            throw new IllegalArgumentException("Usuario no autenticado");
        }

        try {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserPrincipal userPrincipal) {
                logger.debug("Usuario autenticado obtenido: ID={}, Username={}",
                        userPrincipal.getId(), userPrincipal.getUsername());
                return userPrincipal;
            } else {
                logger.error("El principal no es una instancia de UserPrincipal: {}",
                        principal.getClass().getSimpleName());
                throw new IllegalArgumentException("Tipo de usuario no válido en el contexto de seguridad");
            }

        } catch (Exception e) {
            logger.error("Error al obtener usuario autenticado desde el contexto", e);
            throw new IllegalArgumentException("Error al procesar información del usuario autenticado");
        }
    }

    public Long getCurrentUserId() {
        try {
            UserPrincipal user = getUserAuthenticated();
            return user.getId();
        } catch (Exception e) {
            logger.error("Error al obtener ID del usuario actual", e);
            throw new IllegalArgumentException("Error al obtener ID del usuario actual");
        }
    }

    public boolean isCurrentTokenValid() {
        try {
            HttpServletRequest request = getCurrentHttpRequest();
            if (request == null) {
                logger.warn("No se pudo obtener la request HTTP actual");
                return false;
            }

            boolean isValid = jwtProvider.isTokenValid(request);
            logger.debug("Validación del token JWT: {}", isValid ? "VÁLIDO" : "INVÁLIDO");
            return isValid;

        } catch (Exception e) {
            logger.error("Error al verificar validez del token JWT", e);
            return false;
        }
    }

    public void validateUserAndToken() {
        UserPrincipal user = getUserAuthenticated();

        if (!isCurrentTokenValid()) {
            logger.error("Token JWT inválido para usuario: {}", user.getUsername());
            throw new IllegalArgumentException("Token de autenticación inválido o expirado");
        }

        logger.debug("Usuario y token validados correctamente: {}", user.getUsername());
    }

    private HttpServletRequest getCurrentHttpRequest() {
        try {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            return attributes.getRequest();
        } catch (Exception e) {
            logger.warn("No se pudo obtener la HttpServletRequest actual", e);
            return null;
        }
    }

    public String getUserInfo() {
        try {
            UserPrincipal user = getUserAuthenticated();
            return String.format("Usuario[ID=%d, Username=%s, Roles=%s]",
                    user.getId(),
                    user.getUsername(),
                    user.getAuthorities());
        } catch (Exception e) {
            return "Usuario no autenticado";
        }
    }
}
