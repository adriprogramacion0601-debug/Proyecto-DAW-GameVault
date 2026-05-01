package com.gamevault.gamevault.services;

import com.gamevault.gamevault.DTO.JuegoDTO;
import com.gamevault.gamevault.DTO.RawgResponseDTO;
import com.gamevault.gamevault.models.Juego;
import com.gamevault.gamevault.repositories.JuegoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RawgService {

    @Value("${rawg.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.rawg.io/api";

    private final RestTemplate restTemplate;
    private final JuegoRepository juegoRepository;

    public RawgResponseDTO buscarJuegos(String nombre) {
        String url = BASE_URL + "/games?search=" + nombre + "&key=" + apiKey;
        return restTemplate.getForObject(url, RawgResponseDTO.class);
    }

    public String obtenerJuego(Integer rawgId) {
        String url = BASE_URL + "/games/" + rawgId + "?key=" + apiKey;
        return restTemplate.getForObject(url, String.class);
    }

    // Guarda el juego en la BD si no existe ya
    public Juego guardarJuego(Integer rawgId) {
        // Si ya existe en la BD lo devuelve directamente
        return juegoRepository.findByRawgId(rawgId).orElseGet(() -> {
            String url = BASE_URL + "/games/" + rawgId + "?key=" + apiKey;
            JuegoDTO dto = restTemplate.getForObject(url, JuegoDTO.class);

            Juego juego = new Juego();
            assert dto != null;
            juego.setRawgId(dto.getId());
            juego.setTitulo(dto.getName());
            juego.setImagen(dto.getBackgroundImage());
            juego.setFechaLanzamiento(dto.getReleased() != null ?
                    LocalDate.parse(dto.getReleased()) : null);
            juego.setGenero(dto.getGenero());

            return juegoRepository.save(juego);
        });
    }
}
