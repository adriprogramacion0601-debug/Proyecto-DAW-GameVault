package com.gamevault.gamevault.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Juegos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "rawg_id")
    private Integer rawgId;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "imagen")
    private String imagen;

    @Column(name = "fecha_lanzamiento")
    private LocalDate fechaLanzamiento;

    @Column(name = "genero")
    private String genero;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
}
