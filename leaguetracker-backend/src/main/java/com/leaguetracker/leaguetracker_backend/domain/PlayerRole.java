package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum PlayerRole {
  CRUCIAL("Crucial"),
  IMPORTANT("Importante"),
  SPORADIC("Esporádico"),
  ROTATION("Rodicio"),
  PROSPECT("Promessa");

  private final String roleName;

  PlayerRole(String roleName) {
    this.roleName = roleName;
  }
}
