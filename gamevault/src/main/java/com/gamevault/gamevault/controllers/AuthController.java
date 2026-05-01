package com.gamevault.gamevault.controllers;

import com.gamevault.gamevault.DTO.UsuarioResponseDTO;
import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.services.JwtService;
import com.gamevault.gamevault.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService service;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usuario.getEmail(), usuario.getPassword()
                )
        );

        String token = jwtService.generateToken(usuario.getEmail());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> register(@RequestBody Usuario usuario) {
        Usuario guardado = service.registrar(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(guardado.getId());
        response.setNombre(guardado.getNombre());
        response.setEmail(guardado.getEmail());
        response.setRol(guardado.getRol());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<Usuario>> allUsers() {
        return ResponseEntity.ok(service.findAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Usuario>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findUserById(id));
    }
}