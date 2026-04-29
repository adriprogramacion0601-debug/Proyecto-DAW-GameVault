package com.gamevault.gamevault.services;

import com.gamevault.gamevault.models.Usuario;
import com.gamevault.gamevault.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public List<Usuario> findAllUsers() {
        return repo.findAll();
    }
}
