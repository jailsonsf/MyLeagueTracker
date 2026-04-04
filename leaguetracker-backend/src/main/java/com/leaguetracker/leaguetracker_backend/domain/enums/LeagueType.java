package com.leaguetracker.leaguetracker_backend.domain.enums;

import lombok.Getter;

@Getter
public enum LeagueType {
  Cup("Cup"),
  League("League");

  private final String leagueType;

  LeagueType(String leagueType) {
    this.leagueType = leagueType;
  }
}
