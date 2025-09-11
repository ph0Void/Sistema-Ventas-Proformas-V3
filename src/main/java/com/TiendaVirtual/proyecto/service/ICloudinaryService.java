package com.TiendaVirtual.proyecto.service;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    String uploadImage(MultipartFile file);
    void deleteImage(String publicId);
}
