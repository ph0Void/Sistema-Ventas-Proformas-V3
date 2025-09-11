"use client";

import React, {useEffect, useState} from "react";
import {ImageIcon, Upload, X} from "lucide-react";
import {ImageService} from "@/service/ImageService";
import {toast} from "sonner";
import Image from "next/image";

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    onImageRemoved?: () => void;
    disabled?: boolean;
    className?: string;
    label?: string;
    required?: boolean;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    defaultImageUrl?: string; // URL de la imagen por defecto
}

export default function LabelImageUpload({
    onImageUploaded,
    onImageRemoved,
    disabled = false,
    className = "",
    label = "Imagen",
    required = false,
    maxSizeMB = 5,
    acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    defaultImageUrl = ""
}: ImageUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    // Inicializar con imagen por defecto SOLO SI NO HAY IMAGEN SUBIDA
    useEffect(() => {
        if (defaultImageUrl && !uploadedImageUrl) {
            setUploadedImageUrl(defaultImageUrl);
            // NO llamar onImageUploaded aquí para evitar marcar como nueva imagen
        }
    }, [defaultImageUrl]); // Removido onImageUploaded de dependencias

    // Manejar selección de archivo
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!acceptedTypes.includes(file.type)) {
            toast.error(`Tipo de archivo no permitido. Solo: ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`);
            return;
        }

        // Validar tamaño
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
            return;
        }

        setSelectedFile(file);
        // Crear URL de previsualización
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Limpiar estado anterior
        setUploadedImageUrl("");
    };

    // Subir imagen al servidor
    const handleUploadImage = async () => {
        if (!selectedFile) {
            toast.error("Selecciona una imagen primero");
            return;
        }

        setIsUploading(true);
        try {
            const result = await ImageService.upload(selectedFile);

            if (result.success && result.data) {
                const imageUrl = result.data.url;
                setUploadedImageUrl(imageUrl);
                setPreviewUrl(""); // Limpiar preview URL ya que ahora tenemos la imagen subida
                onImageUploaded(imageUrl); // SOLO llamar cuando realmente se sube una nueva imagen
                toast.success("Imagen subida exitosamente");
            } else {
                toast.error(result.message || "Error al subir la imagen");
            }
        } catch (error) {
            toast.error("Error al subir la imagen");
        } finally {
            setIsUploading(false);
        }
    };

    // Eliminar imagen
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setUploadedImageUrl("");

        onImageRemoved?.();
    };

    // Limpiar URL al desmontar componente
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Determinar qué imagen mostrar
    const hasImage = previewUrl || uploadedImageUrl;
    const imageToDisplay = previewUrl || uploadedImageUrl;

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Label */}
            <label className="texto-secundario text-xl font-medium">
                {label} {required && "*"}
            </label>

            {/* Área de subida/preview */}
            {!hasImage ? (
                // Área de subida cuando no hay imagen
                <div
                    className="border-2 border-dashed border-gray-300 dark:border-white/20
                               rounded-lg p-6 text-center hover:border-indigo-400
                               transition-colors cursor-pointer group"
                    onClick={() => !disabled && document.getElementById("image-upload-input")?.click()}
                >
                    <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors" />
                        <div className="space-y-1">
                            <p className="texto-secundario text-sm">
                                Haz clic para seleccionar una imagen
                            </p>
                            <p className="text-xs text-gray-400">
                                {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} hasta {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Preview de imagen
                <div className="relative group">
                    <div className="border border-gray-200 dark:border-white/10 rounded-lg
                        overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <Image
                            width={400}
                            height={300}
                            src={imageToDisplay}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />

                        {/* Overlay con información */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                               transition-opacity flex items-center justify-center">
                            <div className="text-white text-center space-y-1">
                                <ImageIcon size={24} className="mx-auto" />
                                {selectedFile ? (
                                    <>
                                        <p className="text-sm">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm">
                                        Imagen actual
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white
                                   rounded-full hover:bg-red-600 transition-colors
                                   shadow-lg opacity-80 hover:opacity-100"
                        disabled={disabled || isUploading}
                        title="Eliminar imagen"
                    >
                        <X size={16} />
                    </button>

                    {/* Botón cambiar imagen (solo cuando hay imagen subida) */}
                    {uploadedImageUrl && !selectedFile && (
                        <button
                            type="button"
                            onClick={() => document.getElementById("image-upload-input")?.click()}
                            className="absolute top-2 left-2 p-1.5 bg-indigo-500 text-white
                                       rounded-full hover:bg-indigo-600 transition-colors
                                       shadow-lg opacity-80 hover:opacity-100"
                            disabled={disabled || isUploading}
                            title="Cambiar imagen"
                        >
                            <Upload size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Input file oculto */}
            <input
                type="file"
                id="image-upload-input"
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />

            {/* Botón subir - solo cuando hay archivo seleccionado pero no subido */}
            {selectedFile && previewUrl && (
                <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={isUploading || disabled}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white
                               px-4 py-2.5 rounded-lg transition-colors font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center justify-center space-x-2"
                >
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>Subiendo...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={16} />
                            <span>Subir Imagen</span>
                        </>
                    )}
                </button>
            )}

            {/* Estado de éxito - solo cuando se sube una nueva imagen */}
            {uploadedImageUrl && selectedFile && !previewUrl && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200
                               dark:border-green-800 rounded-lg flex items-center space-x-2">
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <p className="text-xl text-green-700 dark:text-green-300 font-medium">
                        Imagen subida correctamente
                    </p>
                </div>
            )}
        </div>
    );
}