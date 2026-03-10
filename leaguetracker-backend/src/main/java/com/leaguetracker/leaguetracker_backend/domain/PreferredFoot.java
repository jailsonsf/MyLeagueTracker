package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum PreferredFoot {
  LEFT("Esquerdo"),
  RIGHT("Direito");

  private final String preferredFoot;

  PreferredFoot(String preferredFoot) {
    this.preferredFoot = preferredFoot;
  }
}
