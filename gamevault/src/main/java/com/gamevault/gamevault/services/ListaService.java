package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Juego;
import com.gamevault.gamevault.models.Lista;
import com.gamevault.gamevault.models.Lista_juego;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.JuegoRepository;
import com.gamevault.gamevault.repositories.ListaRepository;
import com.gamevault.gamevault.repositories.Lista_JuegoRepository;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListaService {

    private final ListaRepository listaRepository;
    private final Lista_JuegoRepository lista_juegoRepository;
    private final UsuarioRepository usuarioRepository;
    private final JuegoRepository juegoRepository;

    // Obtener listas del usuario logueado
    public List<Lista> obtenerMisListas(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return listaRepository.findByUsuarioId(usuario.getId());
    }

    // Crear lista
    public Lista crearLista(String email, String nombre,
                            String descripcion, Boolean publica) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Lista lista = new Lista();
        lista.setUsuario(usuario);
        lista.setNombre(nombre);
        lista.setDescripcion(descripcion);
        lista.setPublica(publica != null ? publica : true);

        return listaRepository.save(lista);
    }

    // Eliminar lista
    public void eliminarLista(String email, Integer listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        if (!lista.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("No tienes permiso para elminar esta lista");
        }

        // Primero elimina los juegos de la lista
        List<Lista_juego> juegos = lista_juegoRepository.findByListaId(listaId);
        lista_juegoRepository.deleteAll(juegos);

        listaRepository.delete(lista);
    }

    // Añadir juego a lista
    public Lista_juego anadirJuegoALista(String email, Integer listaId, Integer juegoId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        if (!lista.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("No tienes permiso para modificar esta lista");
        }

        if (lista_juegoRepository.existsByListaIdAndJuegoId(listaId, juegoId)) {
            throw new RuntimeException("El juego ya está en esta lista");
        }

        Juego juego = juegoRepository.findById(juegoId)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        Lista_juego listaJuego = new Lista_juego();
        listaJuego.setJuego(juego);
        listaJuego.setLista(lista);

        return lista_juegoRepository.save(listaJuego);
    }

    // Obtener juegos de una lista
    public List<Lista_juego> obtenerJuegosLista(Integer listaId) {
        return lista_juegoRepository.findByListaId(listaId);
    }

    // Eliminar juego de lista
    public void eliminarJuegoDeLista(String email, Integer listaId, Integer juegoId) {
        System.out.println(">>> email: " + email + " listaId: " + listaId + " juegoId: " + juegoId);

        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista no encontrada"));

        System.out.println(">>> lista usuario email: " + lista.getUsuario().getEmail());

        if (!lista.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("No tienes permiso para modificar esta lista");
        }

        Lista_juego entrada = lista_juegoRepository.findByListaId(listaId)
                .stream()
                .filter(lj -> lj.getJuego().getId().intValue() == juegoId.intValue())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Juego no encontrado en la lista"));

        lista_juegoRepository.delete(entrada);
    }

}
