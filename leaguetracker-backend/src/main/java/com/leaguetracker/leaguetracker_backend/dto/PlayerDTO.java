package com.leaguetracker.leaguetracker_backend.dto;

import java.time.LocalDate;
import java.util.Set;

import com.leaguetracker.leaguetracker_backend.domain.Position;
import com.leaguetracker.leaguetracker_backend.domain.PreferredFoot;

public record PlayerDTO(
    Long id,
    Long externalId,
    String fullName,
    LocalDate dateOfBirth,
    int overall,
    int potential,
    Set<Position> positions,
    PreferredFoot preferredFoot,
    Long value,
    Long wage,
    int heightCm,
    int weightKg) {
}
