package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gamevault")
public class AuthController {

    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<Usuario>> allUsers() {
        return ResponseEntity.ok(service.findAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Usuario>> findById(@RequestBody Long id) {
        return ResponseEntity.ok(service.findUserById(id));
    }
}