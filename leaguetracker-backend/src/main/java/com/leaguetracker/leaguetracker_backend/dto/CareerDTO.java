package com.leaguetracker.leaguetracker_backend.dto;

import java.math.BigDecimal;

import com.leaguetracker.leaguetracker_backend.domain.enums.GameTitle;

public record CareerDTO(GameTitle game, String manager, String teamName, Long clubId, BigDecimal budget) {

}
