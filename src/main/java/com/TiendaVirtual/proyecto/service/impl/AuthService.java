package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.persistence.model.auth.Role;
import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import com.TiendaVirtual.proyecto.persistence.repository.UserRepository;
import com.TiendaVirtual.proyecto.presentation.dto.req.auth.UserReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.UserDto;
import com.TiendaVirtual.proyecto.security.jwt.IJwtProvider;
import com.TiendaVirtual.proyecto.security.model.UserPrincipal;
import com.TiendaVirtual.proyecto.security.utils.SecurityUtils;
import com.TiendaVirtual.proyecto.service.IAuthService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class AuthService implements IAuthService {
    private final AuthenticationManager authenticationManager;
    private final IJwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final static Logger logger = LoggerFactory.getLogger(AuthService.class);

    /**
     * Inicio de session login
     * @return  retorna un userDto con el token cargado
     */
    @Override
    public UserDto sigInAndReturnJwt(UserReqDto signInRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword())
        );
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtProvider.generateToken(userPrincipal);
        User signUser = userPrincipal.getUser();
        signUser.setToken(token);
        return UserDto.toDto(signUser);
    }

    /**
     * Autentica un usuario y genera un token JWT
     * @param userDto
     * @return String el token JWT
     */
    @Override
    public String signInAuth(UserReqDto userDto) {
        try{
            User userExist = userRepository.findByUsername(userDto.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado con username: " + userDto.getUsername()));

            if (!passwordEncoder.matches(userDto.getPassword(), userExist.getPassword())){
                throw new BadCredentialsException("Contraseña incorrecta para el usuario: " + userDto.getUsername());
            }
            List<String> roles = Arrays.asList(userExist.getRole().name());
            UserPrincipal userPrincipal = UserPrincipal.builder()
                    .id(userExist.getId())
                    .username(userExist.getUsername())
                    .password(userExist.getPassword())
                    .authorities(SecurityUtils.convertToAuthorities(roles))
                    .build();
            String jwtToken = jwtProvider.generateToken(userPrincipal);
            logger.debug("JWT TOKEN AUTHSERVICE.SIGINAUTH : " + jwtToken);
            return jwtToken;
        }catch (Exception e){
            logger.warn("Error al autenticar usuario: " + e.getMessage());
            throw new RuntimeException("Error al autenticar usuario: " + e.getMessage());
        }
    }

    /**
     * Registra un nuevo usuario
     * @param userDto
     * @return String el token JWT
     */
    @Override
    public String signUpAuth(UserReqDto userDto) {
        try{
            if (userRepository.findByUsername(userDto.getUsername()).isPresent()){
                logger.warn("El usuario ya existe: " + userDto.getUsername());
                throw new BadCredentialsException("El usuario ya existe: " + userDto.getUsername());
            }
            User user = new User();
            user.setUsername(userDto.getUsername());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            user.setRole(Role.USER);

            User userCreate = userRepository.save(user);
            String jwtToken = jwtProvider.generateToken(userCreate);
            logger.debug("JWT TOKEN AUTHSERVICE.SIGNUPAUTH : " + jwtToken);
            return jwtToken;
        }catch (Exception e){
            logger.warn("Error al registrar usuario: " + e.getMessage());
            throw new RuntimeException("Error al registrar usuario: " + e.getMessage());
        }
    }
}
