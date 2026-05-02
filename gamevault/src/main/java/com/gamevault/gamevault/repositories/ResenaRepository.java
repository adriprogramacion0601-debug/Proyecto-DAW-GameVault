package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Resenas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResenaRepository extends JpaRepository<Resenas, Integer> {

    // Todas las reseñas de un juego
    List<Resenas> findByJuegoId(Integer juegoId);

    // Todas las reseñas de un usuario
    List<Resenas> findByUsuarioId(Long usuarioId);

    // Buscar reseña concreta de usuario + juego
    Optional<Resenas> findByUsuarioIdAndJuegoId(Long usuarioId, Integer juegoId);

    // Comprobar si ya existe reseña
    boolean existsByUsuarioIdAndJuegoId(Long usuarioId, Integer juegoId);
}
