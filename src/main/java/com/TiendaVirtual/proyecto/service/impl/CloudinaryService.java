package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.service.ICloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@AllArgsConstructor
public class CloudinaryService implements ICloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) {
        try{
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", "tienda_virtual",
                    "resource_type", "image",
                    "quality", "auto",
                    "fetch_format", "auto"
            );
            Map<String, Object> uploadResult = cloudinary.uploader()
                    .upload(file.getBytes(), uploadParams);
            return uploadResult.get("secure_url").toString();
        }catch (IOException e){
            throw new RuntimeException("Error al subir imagen a Cloudinary: " + e.getMessage());
        }
    }

    @Override
    public void deleteImage(String publicId) {

        try {
            Map<String, Object> deleteParams = ObjectUtils.asMap(
                    "resource_type", "image"
            );

            cloudinary.uploader().destroy(publicId, deleteParams);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar imagen de Cloudinary: " + e.getMessage());
        }
    }
}
