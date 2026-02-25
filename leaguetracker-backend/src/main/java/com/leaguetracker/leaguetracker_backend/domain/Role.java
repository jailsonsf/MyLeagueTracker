package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum Role {
  Crucial("Crucial"),
  Important("Importante"),
  Sporadic("Esporádico"),
  Rotation("Rodicio"),
  Prospect("Promessa");

  private final String roleName;

  Role(String roleName) {
    this.roleName = roleName;
  }
}
