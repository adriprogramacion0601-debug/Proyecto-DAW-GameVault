package com.gamevault.gamevault.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class JuegoDTO {

    private Integer id;
    private String name;
    private String slug;
    private String released;
    private Double rating;

    @JsonProperty("background_image")
    private String backgroundImage;

    @JsonProperty("genres")
    private List<GeneroDTO> genres;

    // Devuelve el primer género como String
    public String getGenero() {
        if (genres != null && !genres.isEmpty()) {
            return genres.getFirst().getName();
        }
        return null;
    }

    @Data
    public static class GeneroDTO {
        private String name;
    }
}
