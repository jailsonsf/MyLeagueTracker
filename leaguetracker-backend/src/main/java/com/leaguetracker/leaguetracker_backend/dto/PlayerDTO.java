package com.leaguetracker.leaguetracker_backend.dto;

import java.util.List;

public record PlayerDTO(
    Long id,
    String name,
    int overall,
    int potential,
    List<String> positions,
    int age) {
}
