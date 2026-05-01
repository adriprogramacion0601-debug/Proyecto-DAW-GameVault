package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Juego;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JuegoRepository extends JpaRepository<Juego, Integer> {
    Optional<Juego> findByRawgId(Integer rawgId);
}
