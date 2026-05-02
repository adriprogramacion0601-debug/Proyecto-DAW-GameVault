package com.gamevault.gamevault.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "Amigos",
        uniqueConstraints = @UniqueConstraint(name = "ux_Amigos_usuario_amigo", columnNames = {"usuario_id", "amigo_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Amigo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "amigo_id", referencedColumnName = "id", nullable = false)
    private Usuario amigo;

    @Enumerated(EnumType.STRING)
    private EstadoAmistad estado;

    public enum EstadoAmistad {
        pendiente, aceptado
    }

    @Column(name = "fecha")
    private LocalDate fecha;
}
