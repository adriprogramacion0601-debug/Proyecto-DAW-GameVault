package com.gamevault.gamevault.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "Listas_juegos",
        uniqueConstraints = @UniqueConstraint(name = "ux_Listas_juegos_lista_juego", columnNames = {"lista_id", "juego_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lista_juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "juego_id", referencedColumnName = "id", nullable = false)
    private Juego juego;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lista_id", referencedColumnName = "id", nullable = false)
    private Lista lista;
}
