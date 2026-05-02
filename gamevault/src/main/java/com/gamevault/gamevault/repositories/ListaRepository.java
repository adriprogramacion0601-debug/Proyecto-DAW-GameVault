package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Lista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListaRepository extends JpaRepository<Lista, Integer> {

    // Listas de un usuario
    List<Lista> findByUsuarioId(Long usuarioId);

    // Listas públicas de un usuario
    List<Lista> findByUsuarioIdAndPublicaTrue(Long usuarioId);
}
