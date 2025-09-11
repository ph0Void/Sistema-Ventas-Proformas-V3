package com.TiendaVirtual.proyecto.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthorizationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthorizationFilter.class);
    private final IJwtProvider jwtProvider;

    // Lista para almacenar los patrones de las rutas públicas
    private final List<RequestMatcher> publicMatchers;

    public JwtAuthorizationFilter(IJwtProvider jwtProvider, List<String> publicPaths){
        this.jwtProvider = jwtProvider;
        this.publicMatchers = publicPaths.stream()
                .map(AntPathRequestMatcher::new)
                .collect(Collectors.toList());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try{
            String path = request.getRequestURI();
            // Verifica si la ruta actual es pública
            boolean isPublicPath = publicMatchers.stream()
                    .anyMatch(matcher -> matcher.matches(request));

            if (isPublicPath) {
                // Si la ruta es pública, continúa con el siguiente filtro sin procesar el token
                filterChain.doFilter(request, response);
                return;
            }

            // Verifica si el token es válido
            if (jwtProvider.isTokenValid(request)) {
                // Si el token es válido, obtiene la autenticación y la establece en el contexto de seguridad
                var authentication = jwtProvider.getAuthentication(request);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // Si el token no es válido, limpia el contexto de seguridad
                SecurityContextHolder.clearContext();
                // Establece la respuesta como no autorizada
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                // Opcionalmente, puedes escribir un mensaje de error en la respuesta
                response.getWriter().write("{\"error\": \"Inautorizado\", \"message\": \"Token inválido o ausente\"}");
                response.setContentType("application/json");
                logger.warn("NO SE PUDO ESTABLECER AUTENTICACIÓN PARA EL PATH: {}", path);
                return; // Detiene el procesamiento si el token no es válido
            }
            // Continúa con el siguiente filtro en la cadena
            filterChain.doFilter(request, response);
        }catch (Exception e){
            // Captura cualquier excepción durante el procesamiento del token (firma inválida, etc.)
            logger.error("ERROR AL PROCESAR EL TOKEN PARA EL PATH {}: {}", request.getRequestURI(), e.getMessage());
            // Limpia el contexto de seguridad en caso de error
            SecurityContextHolder.clearContext();
            // Establece la respuesta como no autorizada
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            // Opcionalmente, puedes escribir un mensaje de error en la respuesta
            response.getWriter().write("{\"error\": \"Inautorizado\", \"message\": \"" + e.getMessage() + "\"}");
            response.setContentType("application/json");
            // No llames a filterChain.doFilter(request, response) aquí para detener el procesamiento
            return;
        }
    }
}
