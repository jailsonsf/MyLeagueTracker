package com.leaguetracker.leaguetracker_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.leaguetracker.leaguetracker_backend.domain.GameTitle;

public record CareerDetailsDTO(
    Long id,
    GameTitle game,
    String manager,
    String teamName,
    String teamLogo,
    LocalDate startDate,
    BigDecimal budget) {

}
