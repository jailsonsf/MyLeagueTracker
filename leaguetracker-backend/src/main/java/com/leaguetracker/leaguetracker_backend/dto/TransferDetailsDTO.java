package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.MarketScope;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferDirection;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferMethod;

public record TransferDetailsDTO(
    Long id,
    Long careerId,

    Long seasonId,
    String seasonName,

    MarketScope scope,
    TransferDirection direction,
    TransferMethod method,

    SquadPlayerDTO squadPlayer,
    SquadPlayerDTO playerSwap,

    ClubDetailsDTO originClub,
    ClubDetailsDTO destinationClub,

    Double fee,
    Double marketValue) {
}
