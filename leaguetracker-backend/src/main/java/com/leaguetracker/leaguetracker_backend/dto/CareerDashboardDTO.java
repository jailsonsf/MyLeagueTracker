package com.leaguetracker.leaguetracker_backend.dto;

import java.util.List;

public record CareerDashboardDTO(
  CareerDetailsDTO careerInfo,
  List<SquadPlayerDTO> principalSquad,
  List<YouthPlayerDTO> youthSquad) {
}
