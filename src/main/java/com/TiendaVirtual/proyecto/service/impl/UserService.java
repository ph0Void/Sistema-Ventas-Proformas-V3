package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.persistence.model.auth.Role;
import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import com.TiendaVirtual.proyecto.persistence.repository.UserRepository;
import com.TiendaVirtual.proyecto.presentation.dto.req.auth.UserReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.UserDto;
import com.TiendaVirtual.proyecto.security.jwt.IJwtProvider;
import com.TiendaVirtual.proyecto.service.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IJwtProvider jwtProvider;

    @Override
    public Optional<UserDto> findByUsername(String username) {
        Optional<UserDto> userDto = userRepository.findByUsername(username)
                .map(UserDto::toDto);
        if (!userDto.isPresent()){
            throw new IllegalArgumentException("No existe usuario con username: " + username);
        }
        return userDto;
    }

    @Override
    @Transactional
    public void changeRole(Long userId, String role) {
        try{
            Optional<UserDto> user = userRepository.findById(userId)
                    .map(UserDto::toDto);
            if(!user.isPresent()){
                throw new IllegalArgumentException("No existe usuario con id: " + userId);
            }
            user.get().setRole(role);
            userRepository.save(UserDto.toEntity(user.get()));

        }catch (Exception e){
            throw new RuntimeException("Error al cambiar el rol del usuario con id: " + userId + " a: " + role + " : " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public UserDto save(UserReqDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);

        User userCreate = userRepository.save(user);
        String jwt = jwtProvider.generateToken(userCreate);
        userCreate.setToken(jwt);
        return UserDto.toDto(userCreate);
    }
}
