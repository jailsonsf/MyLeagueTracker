package com.leaguetracker.leaguetracker_backend.dto;

public record SeasonRequestDTO(
  Integer startYear,
  Integer endYear,
  Long careerId
) {}
