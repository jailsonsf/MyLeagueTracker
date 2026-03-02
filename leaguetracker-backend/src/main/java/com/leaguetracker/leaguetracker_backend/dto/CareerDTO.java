package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.GameTitle;

public record CareerDTO(GameTitle game, String manager, String teamName) {

}
