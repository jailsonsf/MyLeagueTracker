package com.leaguetracker.leaguetracker_backend.dto;

public record SeasonDetailsDTO(
  Long id,
  Integer startYear,
  Integer endYear,
  Long careerId
) {}
