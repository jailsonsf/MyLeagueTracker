package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.IndividualAwardType;

public record TrophyRequestDTO(
    String category,
    Long seasonId,
    Long leagueId,
    Long careerId,
    Long playerId,
    String playerName,
    IndividualAwardType awardType,
    Integer goalsCount,
    Integer assistsCount,
    Boolean isWinner,
    String classification) {
}
