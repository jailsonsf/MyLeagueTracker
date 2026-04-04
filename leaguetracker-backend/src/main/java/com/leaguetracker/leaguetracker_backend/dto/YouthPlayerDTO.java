package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.PlayerRole;
import com.leaguetracker.leaguetracker_backend.domain.enums.PreferredFoot;

public record YouthPlayerDTO(
  Long id,
  String fullName,
  int startingOverall,
  int currentOverall,
  int potentialOverall,
  long currentMarketValue,
  long currentWage,
  String image,
  int heightCm,
  int weightKg,
  int age,
  int yearJoinedClub,
  PreferredFoot preferredFoot,
  int kitNumber,
  Long countryId,
  Long careerSquadId,
  PlayerRole role) {
}
