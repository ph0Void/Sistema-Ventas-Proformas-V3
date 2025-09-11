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

    /**
     * Obtiene el usuario autenticado completo desde el contexto de seguridad JWT
     * @return UserPrincipal del usuario autenticado
     * @throws IllegalArgumentException si el usuario no está autenticado
     */
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

    /**
     * Obtiene el ID del usuario autenticado
     * @return ID del usuario
     */
    public Long getCurrentUserId() {
        try {
            UserPrincipal user = getUserAuthenticated();
            return user.getId();
        } catch (Exception e) {
            logger.error("Error al obtener ID del usuario actual", e);
            throw new IllegalArgumentException("Error al obtener ID del usuario actual");
        }
    }

    /**
     * Verifica si el token JWT actual es válido
     * @return true si el token es válido, false en caso contrario
     */
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

    /**
     * Valida tanto la autenticación como la validez del token
     * @throws IllegalArgumentException si la validación falla
     */
    public void validateUserAndToken() {
        // Verifica que el usuario esté autenticado
        UserPrincipal user = getUserAuthenticated();

        // Verifica que el token sea válido
        if (!isCurrentTokenValid()) {
            logger.error("Token JWT inválido para usuario: {}", user.getUsername());
            throw new IllegalArgumentException("Token de autenticación inválido o expirado");
        }

        logger.debug("Usuario y token validados correctamente: {}", user.getUsername());
    }

    /**
     * Obtiene la HttpServletRequest actual
     * @return HttpServletRequest actual o null si no está disponible
     */
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

    /**
     * Obtiene información completa del usuario para logging
     * @return String con información del usuario
     */
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