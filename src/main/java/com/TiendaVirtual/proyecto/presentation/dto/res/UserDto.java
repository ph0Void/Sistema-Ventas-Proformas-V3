package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.auth.Role;
import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String role;
    private String token;

    public static UserDto toDto (User user){
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .role(user.getRole().toString())
                .token(user.getToken())
                .build();
    }

    public static User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRole(Role.valueOf(dto.getRole()));
        user.setToken(dto.getToken());
        return user;
    }
}
