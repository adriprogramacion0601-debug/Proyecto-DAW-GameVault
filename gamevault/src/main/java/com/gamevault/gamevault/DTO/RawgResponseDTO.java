package com.gamevault.gamevault.DTO;

import lombok.Data;

import java.util.List;

@Data
public class RawgResponseDTO {

    private Integer count;
    private List<JuegoDTO> results;
}
