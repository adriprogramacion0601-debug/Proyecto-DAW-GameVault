package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Comentario;
import com.gamevault.gamevault.models.Resenas;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.ComentarioRepository;
import com.gamevault.gamevault.repositories.ResenaRepository;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;

    // Obtener comentarios de una reseña
    public List<Comentario> obtenerComentarios(Integer resenaId) {
        return comentarioRepository.findByResenaId(resenaId);
    }

    // Crear comentario
    public Comentario crearComentario(String email, Integer resenaId, String contenido) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Resenas resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        Comentario comentario = new Comentario();
        comentario.setUsuario(usuario);
        comentario.setResena(resena);
        comentario.setContenido(contenido);
        comentario.setFecha(LocalDate.now());

        return comentarioRepository.save(comentario);
    }

    // Eliminar comentario
    public void eliminarComentario(String email, Integer comentarioId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado"));

        if (!comentario.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("No tienes permiso para eliminar este comentario");
        }

        comentarioRepository.delete(comentario);
    }
}
