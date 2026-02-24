package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum GameTitle {
  EA_FC_24("EA FC 24"),
  EA_FC_25("EA FC 25"),
  EA_FC_26("EA FC 26");

  private final String displayGameName;

  GameTitle(String displayGameName) {
    this.displayGameName = displayGameName;
  }
}
