package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.LeagueType;

public record LeagueInfoDTO(Long id, String name, LeagueType type, String logo, String countryName) {

}
