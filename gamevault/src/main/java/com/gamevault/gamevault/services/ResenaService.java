package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Juego;
import com.gamevault.gamevault.models.Resenas;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.JuegoRepository;
import com.gamevault.gamevault.repositories.ResenaRepository;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;

    // Obtener todas las reseñas de un juego
    public List<Resenas> obtenerResenasPorJuego(Integer juegoId) {
        return resenaRepository.findByJuegoId(juegoId);
    }

    // Obtener todas las reseñas de un usuario
    public List<Resenas> obtenerResenasPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return resenaRepository.findByUsuarioId(usuario.getId());
    }

    // Crear reseña
    public Resenas crearResena(String email, Integer juegoId,
                               Integer puntuacion, String comentario) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Juego juego = juegoRepository.findById(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        if (resenaRepository.existsByUsuarioIdAndJuegoId(usuario.getId(), juegoId)) {
            throw new RuntimeException("Ya has reseñado este juego");
        }

        if (puntuacion < 1 || puntuacion > 10) {
            throw new RuntimeException("La puntuación debe estar entre 1 y 10");
        }

        Resenas resena = new Resenas();
        resena.setUsuario(usuario);
        resena.setJuego(juego);
        resena.setPuntuacion(puntuacion);
        resena.setComentario(comentario);
        resena.setFecha(LocalDate.now());

        return resenaRepository.save(resena);

    }

    // Editar reseña
    public Resenas editarResena(String email, Integer juegoId,
                                Integer puntuacion, String comentario) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Resenas resena = resenaRepository.findByUsuarioIdAndJuegoId(usuario.getId(), juegoId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        if (puntuacion < 1 || puntuacion > 10) {
            throw new RuntimeException("La puntuación debe estar entre 1 y 10");
        }

        resena.setPuntuacion(puntuacion);
        resena.setComentario(comentario);

        return resenaRepository.save(resena);
    }

    // Eliminar reseña
    public void eliminarResena(String email, Integer juegoId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Resenas resena = resenaRepository.findByUsuarioIdAndJuegoId(usuario.getId(), juegoId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        resenaRepository.delete(resena);
    }
}

