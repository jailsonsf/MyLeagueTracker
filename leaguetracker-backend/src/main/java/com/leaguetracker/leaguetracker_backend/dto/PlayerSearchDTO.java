package com.leaguetracker.leaguetracker_backend.dto;

public record PlayerSearchDTO(
  Long id,
  Long externalId,
  String fullName,
  Integer overallMin,
  Integer overallMax,
  Integer potentialMin,
  Integer potentialMax,
  String position,
  Long valueMin,
  Long valueMax) {

}
