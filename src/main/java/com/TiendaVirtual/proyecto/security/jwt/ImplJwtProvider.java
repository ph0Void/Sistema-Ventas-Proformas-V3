package com.TiendaVirtual.proyecto.security.jwt;

import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import com.TiendaVirtual.proyecto.security.model.UserPrincipal;
import com.TiendaVirtual.proyecto.security.utils.JwtUtils;
import com.TiendaVirtual.proyecto.security.utils.SecurityUtils;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SignatureException;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ImplJwtProvider implements IJwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(ImplJwtProvider.class);

    @Value("${app.jwt.secret}")
    private String JWT_SECRET;

    @Value("${app.jwt.expiration}")
    private Long JWT_EXPIRATION;

    private Key getSignKey(){
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generateToken(UserPrincipal auth) {
        String authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        Key key = getSignKey();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        return Jwts.builder()
                .setSubject(auth.getUsername())
                .claim("roles", authorities)
                .claim("userId", auth.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256  )
                .compact();
    }

    @Override
    public String generateToken(User user) {
        Key key = getSignKey();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);
        String authorities = user.getRole().name();
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", authorities)
                .claim("userId", user.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public Authentication getAuthentication(HttpServletRequest request) {
        try{
            Claims claims = extractClaims(request);
            if (claims == null){
                logger.debug("No se pudieron extraer claims del token.");
                return null;
            }

            String username = claims.getSubject();
            if (username == null){
                logger.warn("Username no encontrado en los claims del JWT.");
                return null;
            }
            Long userId = claims.get("userId", Long.class);
            String rolesClaim = claims.get("roles", String.class);
            if (rolesClaim == null || rolesClaim.isEmpty() ){
                logger.warn("Claim 'roles' está vacío o no existe en el JWT para el usuario: {}", username);
                rolesClaim = ""; 
            }
            if (userId == null){
                logger.warn("Claim 'userId' no encontrado en los claims del JWT para el usuario: {}", username);
            }

            Set<GrantedAuthority> authorities = Arrays.stream(rolesClaim.split(","))
                    .map(String::trim)
                    .filter(role-> !role.isEmpty())
                    .map(SecurityUtils::converToAuthority)
                    .collect(Collectors.toSet());
            UserDetails userDetails = UserPrincipal.builder()
                    .id(userId)
                    .username(username)
                    .authorities(authorities)
                    .build();
            return new UsernamePasswordAuthenticationToken(
              userDetails,
              null,
              userDetails.getAuthorities()
            );

        }catch (Exception e){
            logger.error("ERROR AL EXTRACER DATOS DEL TOKEN JWT: {} ", e.getMessage());
            return null;
        }
    }

    @Override
    public boolean isTokenValid(HttpServletRequest request) {
        try{
            Claims claims = extractClaims(request);
            return claims != null;
        }catch (ExpiredJwtException e) {
            logger.warn("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("Token JWT no soportado: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("Token JWT mal formado: {}", e.getMessage());
        } catch (SignatureException e) {
            logger.error("Fallo en la firma del token JWT: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warn("Argumento ilegal o claims JWT vacíos: {}", e.getMessage());
        } catch (Exception e) { 
            logger.error("Error inesperado al validar el token JWT: {}", e.getMessage());
        }
        return false;
    }

    private Claims extractClaims(HttpServletRequest request)throws ExpiredJwtException, UnsupportedJwtException, MalformedJwtException, SignatureException, IllegalArgumentException {
        String token = JwtUtils.extractTokenFromRequest(request);
        if (token == null){
            logger.debug("No se encontró token JWT en la cabecera 'Authorization' al intentar extraer claims. {} ", request.getRequestURI() );
            return null;
        }
        try{
            Key key = getSignKey();
            return Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e){
            logger.error("Error al extraer claims del token JWT: {} ", e.getMessage());
            throw new MalformedJwtException("Error al extraer claims del token JWT: " + e.getMessage());
        }
    }
}
