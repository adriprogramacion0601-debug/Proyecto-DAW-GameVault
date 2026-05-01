package com.gamevault.gamevault.repositories;


import com.gamevault.gamevault.models.Biblioteca;
import com.gamevault.gamevault.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BibliotecaRepository extends JpaRepository<Biblioteca, Integer> {

    // Obtener todos los juegos de un usuario
    List<Biblioteca> findByUsuario(Usuario usuario);

    // Buscar una entrada concreta de usuario + juego
    Optional<Biblioteca> findByUsuarioIdAndJuegoId(Long usuarioId, Integer juegoId);

    // Comprobar si un usuario ya tiene ese juego
    boolean existsByUsuarioIdAndJuegoId(Long usuarioId, Integer juegoId);
}
