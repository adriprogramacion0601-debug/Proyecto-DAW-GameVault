package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Amigo;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.AmigoRepository;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmigoService {

    private final AmigoRepository amigoRepository;
    private final UsuarioRepository usuarioRepository;

    // Enviar solicitud de amistad
    public Amigo enviarSolicitud(String emailOrigen, Long amigoId) {
        Usuario origen = usuarioRepository.findByEmail(emailOrigen)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Usuario destino = usuarioRepository.findById(amigoId)
                .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado"));

        if (origen.getId().equals(amigoId)) {
            throw new RuntimeException("No puedes enviarte una solicitud a ti mismo");
        }

        if (amigoRepository.existsByUsuarioIdAndAmigoId(origen.getId(), amigoId)) {
            throw new RuntimeException("Ya existe una solicitud pendiente");
        }

        Amigo solicitud = new Amigo();
        solicitud.setUsuario(origen);
        solicitud.setAmigo(destino);
        solicitud.setEstado(Amigo.EstadoAmistad.pendiente);
        solicitud.setFecha(LocalDate.now());

        return amigoRepository.save(solicitud);
    }

    // Aceptar solicitud de amistad
    public Amigo aceptarSolicitud(String email, Integer solicitudId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Amigo solicitud = amigoRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (!solicitud.getAmigo().getId().equals(usuario.getId())) {
            throw new RuntimeException("No tienes permiso para aceptar esta solicitud");
        }

        solicitud.setEstado(Amigo.EstadoAmistad.aceptado);
        return amigoRepository.save(solicitud);
    }

    // Rechazar o eliminar solicitud
    public void eliminarSolicitud(String email, Integer solicitudId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Amigo solicitud = amigoRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (!solicitud.getAmigo().getId().equals(usuario.getId()) &&
                !solicitud.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No tienes permiso");
        }

        amigoRepository.delete(solicitud);
    }

    // Ver solicitudes pendientes recibidas
    public List<Amigo> solicitudesPendientes(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return amigoRepository.findByAmigoIdAndEstado(
                usuario.getId(), Amigo.EstadoAmistad.pendiente
        );
    }

    // Ver amigos aceptados
    public List<Amigo> misAmigos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return amigoRepository.findByUsuarioIdAndEstado(
                usuario.getId(), Amigo.EstadoAmistad.aceptado
        );
    }
}
