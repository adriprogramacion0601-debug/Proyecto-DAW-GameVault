package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Biblioteca;
import com.gamevault.gamevault.models.Juego;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.BibliotecaRepository;
import com.gamevault.gamevault.repositories.JuegoRepository;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BibliotecaService {

    private final BibliotecaRepository bibliotecaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;

    // Obtener biblioteca de un usuario
    public List<Biblioteca> obtenerBiblioteca(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return bibliotecaRepository.findByUsuario(usuario);
    }

    // Añadir juego a la biblioteca
    public Biblioteca anadirJuego(String email, Integer juegoId, String estado) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Juego juego = juegoRepository.findById(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        if (bibliotecaRepository.existsByUsuarioIdAndJuegoId(usuario.getId(), juegoId)) {
            throw new RuntimeException("El juego ya está en tu biblioteca");
        }

        Biblioteca entrada = new Biblioteca();
        entrada.setUsuario(usuario);
        entrada.setJuego(juego);
        entrada.setEstado(Biblioteca.EstadoJuego.valueOf(estado));
        entrada.setFechaAnadido(LocalDate.now());

        return bibliotecaRepository.save(entrada);
    }

    // Cambiar estado de un juego
    public Biblioteca cambiarEstado(String email, Integer juegoId, String nuevoEstado) {
        Long usuarioId = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")).getId();

        Biblioteca entrada = bibliotecaRepository.findByUsuarioIdAndJuegoId(usuarioId, juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado en tu biblioteca"));

        entrada.setEstado(Biblioteca.EstadoJuego.valueOf(nuevoEstado));
        return bibliotecaRepository.save(entrada);
    }

    // Eliminar juego de la biblioteca
    public void eliminarJuego(String email, Integer juegoId) {
        Long usuarioId = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")).getId();

        Biblioteca entrada = bibliotecaRepository.findByUsuarioIdAndJuegoId(usuarioId, juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado en tu biblioteca"));

        bibliotecaRepository.delete(entrada);
    }
}