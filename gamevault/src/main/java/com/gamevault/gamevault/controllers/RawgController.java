package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.DTO.RawgResponseDTO;
import com.gamevault.gamevault.models.Juego;
import com.gamevault.gamevault.services.RawgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/juegos")
@RequiredArgsConstructor
public class RawgController {

    private final RawgService rawg;

    // Buscar juegos en RAWG
    @GetMapping("/buscar")
    public RawgResponseDTO buscarJuegos(@RequestParam String nombre) {
        return rawg.buscarJuegos(nombre);
    }

    // Guardar juego de RAWG en mí BD
    @PostMapping("/guardar/{rawgId}")
    public ResponseEntity<Juego> guardarJuego(@PathVariable Integer rawgId) {
        return ResponseEntity.ok(rawg.guardarJuego(rawgId));
    }
}
