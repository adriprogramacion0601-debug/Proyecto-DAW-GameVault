package com.gamevault.gamevault.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "biografia", columnDefinition = "TEXT")
    private String biografia;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    // Un usuario tiene MUCHAS reseñas
    @OneToMany(mappedBy = "usuario")
    private List<Resenas> resenas;
}
