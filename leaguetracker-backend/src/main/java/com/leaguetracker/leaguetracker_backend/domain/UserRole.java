package com.leaguetracker.leaguetracker_backend.domain;

import lombok.Getter;

@Getter
public enum UserRole {
  ADMIN("Administrator"),
  USER("User");

  private final String userRoleName;

  UserRole(String userRoleName) {
    this.userRoleName = userRoleName;
  }
}
