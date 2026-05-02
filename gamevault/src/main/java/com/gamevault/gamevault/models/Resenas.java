package com.gamevault.gamevault.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Reseñas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resenas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "puntuacion", nullable = false)
    private Integer puntuacion;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha")
    private LocalDate fecha;

    // Cada reseña pertenece a UN usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

    // Cada reseña es de UN juego
    @ManyToOne
    @JoinColumn(name = "juego_id", referencedColumnName = "id", nullable = false)
    private Juego juego;
}
