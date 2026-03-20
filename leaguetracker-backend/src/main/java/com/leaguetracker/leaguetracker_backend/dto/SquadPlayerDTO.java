package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.PlayerRole;
import com.leaguetracker.leaguetracker_backend.domain.PreferredFoot;

public record SquadPlayerDTO(
    Long id,
    String fullName,
    int currentOverall,
    int potentialOverall,
    long currentMarketValue,
    int age,
    int yearJoinedClub,
    PreferredFoot preferredFoot,
    Long countryId,
    Long careerSquadId,
    PlayerRole role) {
}
