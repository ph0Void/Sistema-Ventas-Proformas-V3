package com.TiendaVirtual.proyecto.service.common;

import java.util.List;

import java.util.Optional;
/**
 * Interfas generica para operaciones CRUD en el servicio
 * @param <D> DTO
 * @param <R> Request DTO
 * @param <I> ID primary
 */
public interface ICrudService <D,R , I> {
    default D save(R dto){
        return null;
    }

    default D update(I id, R dto){
        return null;
    }

    default void delete(I id){

    }

    default Optional<D> findById(I id){
        return Optional.empty();
    }

    default List<D> findAll(){
        return List.of();
    }
}