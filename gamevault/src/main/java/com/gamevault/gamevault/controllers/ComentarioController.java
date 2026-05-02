package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Comentario;
import com.gamevault.gamevault.services.ComentarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comentarios")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    // GET /api/comentarios/resena/{resenaId}
    @GetMapping("/resena/{resenaId}")
    public ResponseEntity<List<Comentario>> porResena(
            @PathVariable Integer resenaId) {
        return ResponseEntity.ok(
                comentarioService.obtenerComentarios(resenaId)
        );
    }

    // POST /api/comentarios
    @PostMapping
    public ResponseEntity<Comentario> crear(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                comentarioService.crearComentario(
                        userDetails.getUsername(),
                        Integer.parseInt(body.get("resenaId")),
                        body.get("contenido")
                )
        );
    }

    // DELETE /api/comentarios/{comentarioId}
    @DeleteMapping("/{comentarioId}")
    public ResponseEntity<?> eliminar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer comentarioId) {
        comentarioService.eliminarComentario(
                userDetails.getUsername(), comentarioId
        );
        return ResponseEntity.ok(Map.of("mensaje", "Comentario eliminado correctamente"));
    }
}
