package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.PlayerRole;
import com.leaguetracker.leaguetracker_backend.domain.enums.PreferredFoot;

public record SquadPlayerDTO(
  Long id,
  String fullName,
  String image,
  int age,
  int yearJoinedClub,
  int startingOverall,
  int currentOverall,
  int potentialOverall,
  long currentMarketValue,
  long currentWage,
  PreferredFoot preferredFoot,
  Long countryId,
  Long careerSquadId,
  PlayerRole role,
  int kitNumber) {
}
