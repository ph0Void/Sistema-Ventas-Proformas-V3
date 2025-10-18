package com.TiendaVirtual.proyecto.service.common;

import java.util.List;

import java.util.Optional;

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
