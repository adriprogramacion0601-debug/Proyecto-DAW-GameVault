package com.gamevault.gamevault.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Biblioteca")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Biblioteca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "juego_id", referencedColumnName = "id", nullable = false)
    private Juego juego;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoJuego estado;

    public enum EstadoJuego {
        jugando, completado, pendiente, abandonado
    }

    @Column(name = "fecha_añadido")
    private LocalDate fechaAnadido;
}
