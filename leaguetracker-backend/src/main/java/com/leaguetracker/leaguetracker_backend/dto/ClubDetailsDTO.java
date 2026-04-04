package com.leaguetracker.leaguetracker_backend.dto;

public record ClubDetailsDTO(
    Long id,
    String name,
    String logo,
    int clubRating) {
}
