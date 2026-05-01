package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Biblioteca;
import com.gamevault.gamevault.services.BibliotecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/biblioteca")
@RequiredArgsConstructor
public class BibliotecaController {

    private final BibliotecaService bibliotecaService;

    //GET /api/biblioteca
    @GetMapping
    public ResponseEntity<List<Biblioteca>> obtenerBiblioteca(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                bibliotecaService.obtenerBiblioteca(userDetails.getUsername())
        );
    }

    // POST /api/biblioteca
    @PostMapping
    public ResponseEntity<Biblioteca> anadirJuego(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                bibliotecaService.anadirJuego(
                        userDetails.getUsername(),
                        Integer.parseInt(body.get("juegoId")),
                        body.get("estado")
                )
        );
    }

    // PUT /api/biblioteca/{juegoId}
    @PutMapping("/{juegoId}")
    public ResponseEntity<Biblioteca> cambiarEstado(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer juegoId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                bibliotecaService.cambiarEstado(
                        userDetails.getUsername(),
                        juegoId,
                        body.get("estado")
                )
        );
    }

    // DELETE /api/biblioteca/{juegoId}
    @DeleteMapping("/{juegoId}")
    public ResponseEntity<?> eliminarJuego(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer juegoId) {
        bibliotecaService.eliminarJuego(userDetails.getUsername(), juegoId);
        return ResponseEntity.ok(Map.of("mensaje", "Juego eliminado de tu biblioteca"));
    }
}

