package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

    // Comentarios de una reseña
    List<Comentario> findByResenaId(Integer resenaId);

    // Comentarios de un usuario
    List<Comentario> findByUsuarioId(Long usuarioId);
}
