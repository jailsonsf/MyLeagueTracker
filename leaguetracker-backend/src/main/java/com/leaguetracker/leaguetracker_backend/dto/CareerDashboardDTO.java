package com.leaguetracker.leaguetracker_backend.dto;

import java.util.List;

public record CareerDashboardDTO(
  CareerDetailsDTO careerInfo,
  Long careerSquadId,
  List<SquadPlayerDTO> principalSquad,
  List<YouthPlayerDTO> youthSquad) {
}
