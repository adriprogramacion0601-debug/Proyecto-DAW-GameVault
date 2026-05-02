package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Lista_juego;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Lista_JuegoRepository extends JpaRepository<Lista_juego, Integer> {

    List<Lista_juego> findByListaId(Integer listaId);

    boolean existsByListaIdAndJuegoId(Integer listaId, Integer juegoId);
}
