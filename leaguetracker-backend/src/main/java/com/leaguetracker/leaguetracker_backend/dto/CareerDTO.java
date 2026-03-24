package com.leaguetracker.leaguetracker_backend.dto;

import java.math.BigDecimal;

import com.leaguetracker.leaguetracker_backend.domain.GameTitle;

public record CareerDTO(GameTitle game, String manager, String teamName, Long clubId, BigDecimal budget) {

}
