package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.MarketScope;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferDirection;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferMethod;

public record TransferRequestDTO(
    Long id,
    Long careerId,
    Long seasonId,
    MarketScope scope,
    TransferDirection direction,
    TransferMethod method,

    Long squadPlayerId,
    SquadPlayerDTO newSquadPlayer,

    Long playerSwapId,
    SquadPlayerDTO newPlayerSwap,

    Long originClubId,
    Long destinationClubId,
    Double fee,
    Double marketValue) {
}
