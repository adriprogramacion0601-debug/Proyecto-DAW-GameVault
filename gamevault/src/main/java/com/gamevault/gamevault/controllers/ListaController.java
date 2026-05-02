package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Lista;
import com.gamevault.gamevault.models.Lista_juego;
import com.gamevault.gamevault.services.ListaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listas")
@RequiredArgsConstructor
public class ListaController {

    private final ListaService listaService;

    // GET /api/listas — mis listas
    @GetMapping
    public ResponseEntity<List<Lista>> misListas(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                listaService.obtenerMisListas(userDetails.getUsername())
        );
    }

    // POST /api/listas — crear lista
    @PostMapping
    public ResponseEntity<Lista> crear(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                listaService.crearLista(
                        userDetails.getUsername(),
                        body.get("nombre"),
                        body.get("descripcion"),
                        Boolean.parseBoolean(body.getOrDefault("publica", "true"))
                )
        );
    }

    // DELETE /api/listas/{listaId} — eliminar lista
    @DeleteMapping("/{listaId}")
    public ResponseEntity<?> eliminar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer listaId) {
        listaService.eliminarLista(userDetails.getUsername(), listaId);
        return ResponseEntity.ok(Map.of("mensaje", "Lista eliminada correctamente"));
    }

    // GET /api/listas/{listaId}/juegos — juegos de una lista
    @GetMapping("/{listaId}/juegos")
    public ResponseEntity<List<Lista_juego>> juegosLista(
            @PathVariable Integer listaId) {
        return ResponseEntity.ok(listaService.obtenerJuegosLista(listaId));
    }

    // POST /api/listas/{listaId}/juegos — añadir juego a lista
    @PostMapping("/{listaId}/juegos")
    public ResponseEntity<Lista_juego> anadirJuego(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer listaId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                listaService.anadirJuegoALista(
                        userDetails.getUsername(),
                        listaId,
                        Integer.parseInt(body.get("juegoId"))
                )
        );
    }

    // DELETE /api/listas/{listaId}/juegos/{juegoId} — quitar juego de lista
    @DeleteMapping("/{listaId}/juegos/{juegoId}")
    public ResponseEntity<?> eliminarJuego(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer listaId,
            @PathVariable Integer juegoId) {
        listaService.eliminarJuegoDeLista(
                userDetails.getUsername(), listaId, juegoId
        );
        return ResponseEntity.ok(Map.of("mensaje", "Juego eliminado de la lista"));
    }
}
