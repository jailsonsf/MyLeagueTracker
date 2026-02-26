package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum PlayerRole {
  Crucial("Crucial"),
  Important("Importante"),
  Sporadic("Esporádico"),
  Rotation("Rodicio"),
  Prospect("Promessa");

  private final String roleName;

  PlayerRole(String roleName) {
    this.roleName = roleName;
  }
}
