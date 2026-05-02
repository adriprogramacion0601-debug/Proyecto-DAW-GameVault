package com.gamevault.gamevault.repositories;

import com.gamevault.gamevault.models.Amigo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AmigoRepository extends JpaRepository<Amigo, Integer> {
    // Solicitudes recibidas pendientes
    List<Amigo> findByAmigoIdAndEstado(Long amigoId, Amigo.EstadoAmistad estado);

    // Amigos aceptados del usuario
    List<Amigo> findByUsuarioIdAndEstado(Long usuarioId, Amigo.EstadoAmistad estado);

    // Buscar relación concreta entre dos usuarios
    Optional<Amigo> findByUsuarioIdAndAmigoId(Long usuarioId, Long amigoId);

    // Comprobar si ya existe solicitud
    boolean existsByUsuarioIdAndAmigoId(Long usuarioId, Long amigoId);
}

