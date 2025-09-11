package com.TiendaVirtual.proyecto.presentation.dto.res;

import com.TiendaVirtual.proyecto.persistence.model.Client;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDto {
    private String fullName;

    private int dni;

    private int phone;

    private String email;

    public static ClientDto toDto(Client client){
        ClientDto clientDto = new ClientDto();
        clientDto.setFullName(client.getFullName());
        clientDto.setDni(client.getDni());
        clientDto.setPhone(client.getPhone());
        clientDto.setEmail(client.getEmail());
        return clientDto;
    }
}
