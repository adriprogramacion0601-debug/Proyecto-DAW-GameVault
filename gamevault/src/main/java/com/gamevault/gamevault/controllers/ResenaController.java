package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Resenas;
import com.gamevault.gamevault.services.ResenaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
@RequiredArgsConstructor
public class ResenaController {

    private final ResenaService resenaService;

    // GET /api/resenas/juego/{juegoId} - reseñas de un juego
    @GetMapping("/juego/{juegoId}")
    public ResponseEntity<List<Resenas>> porJuego(@PathVariable Integer juegoId) {
        return ResponseEntity.ok(resenaService.obtenerResenasPorJuego(juegoId));
    }

    // GET /api/resenas/mis-resenas - reseñas del usuario logueado
    @GetMapping("/mis-resenas")
    public ResponseEntity<List<Resenas>> misResenas(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                resenaService.obtenerResenasPorUsuario(
                        userDetails.getUsername()));

    }

    // POST /api/resenas - crear reseña
    @PostMapping
    public ResponseEntity<Resenas> crear(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                resenaService.crearResena(
                        userDetails.getUsername(),
                        Integer.parseInt(body.get("juegoId")),
                        Integer.parseInt(body.get("puntuacion")),
                        body.get("comentario")
                )
        );
    }

    // PUT /api/resenas/{juegoId} — editar reseña
    @PutMapping("/{juegoId}")
    public ResponseEntity<Resenas> editar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer juegoId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                resenaService.editarResena(
                        userDetails.getUsername(),
                        juegoId,
                        Integer.parseInt(body.get("puntuacion")),
                        body.get("comentario")
                )
        );
    }

    // DELETE /api/resenas/{juegoId} - eliminar reseña
    @DeleteMapping("/{juegoId}")
    public ResponseEntity<?> eliminar(@AuthenticationPrincipal UserDetails userDetails,
                                      @PathVariable Integer juegoId) {
        resenaService.eliminarResena(userDetails.getUsername(), juegoId);
        return ResponseEntity.ok(Map.of("mensaje", "Reseña elminada correctamente"));
    }
}
