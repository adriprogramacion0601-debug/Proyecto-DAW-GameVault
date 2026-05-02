package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Amigo;
import com.gamevault.gamevault.services.AmigoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/amigos")
@RequiredArgsConstructor
public class AmigoController {

    private final AmigoService amigoService;

    // GET /api/amigos — mis amigos aceptados
    @GetMapping
    public ResponseEntity<List<Amigo>> misAmigos(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                amigoService.misAmigos(userDetails.getUsername())
        );
    }

    // GET /api/amigos/solicitudes — solicitudes pendientes
    @GetMapping("/solicitudes")
    public ResponseEntity<List<Amigo>> solicitudes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                amigoService.solicitudesPendientes(userDetails.getUsername())
        );
    }

    // POST /api/amigos/solicitud — enviar solicitud
    @PostMapping("/solicitud")
    public ResponseEntity<Amigo> enviar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                amigoService.enviarSolicitud(
                        userDetails.getUsername(),
                        Long.parseLong(body.get("amigoId"))
                )
        );
    }

    // PUT /api/amigos/aceptar/{solicitudId} — aceptar solicitud
    @PutMapping("/aceptar/{solicitudId}")
    public ResponseEntity<Amigo> aceptar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer solicitudId) {
        return ResponseEntity.ok(
                amigoService.aceptarSolicitud(
                        userDetails.getUsername(), solicitudId
                )
        );
    }

    // DELETE /api/amigos/{solicitudId} — rechazar o eliminar
    @DeleteMapping("/{solicitudId}")
    public ResponseEntity<?> eliminar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer solicitudId) {
        amigoService.eliminarSolicitud(
                userDetails.getUsername(), solicitudId
        );
        return ResponseEntity.ok(Map.of("mensaje", "Solicitud eliminada"));
    }
}
