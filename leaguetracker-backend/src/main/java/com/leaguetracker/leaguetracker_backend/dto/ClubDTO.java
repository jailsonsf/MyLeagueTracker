package com.leaguetracker.leaguetracker_backend.dto;

import java.util.List;

public record ClubDTO(
    Long id,
    Long externalId,
    String name,
    String logo,
    int clubRating,
    List<PlayerDTO> players) {
}
