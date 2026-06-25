package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.service.SquadPlayerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/squad/players")
@RequiredArgsConstructor
public class SquadPlayerController {

  private final SquadPlayerService squadPlayerService;

  @PostMapping()
  public ResponseEntity<SquadPlayerDTO> createOrUpdate(@RequestBody SquadPlayerDTO squadPlayerDTO) {
    SquadPlayer squadPlayer = squadPlayerService.saveOrUpdate(squadPlayerDTO);
    return ResponseEntity.ok(convertToSquadPlayerDTO(squadPlayer));
  }

  private SquadPlayerDTO convertToSquadPlayerDTO(SquadPlayer squad) {
    return new SquadPlayerDTO(
        squad.getId(),
        squad.getFullName(),
        squad.getImage(),
        squad.getAge(),
        squad.getYearJoinedClub(),
        squad.getStartingOverall(),
        squad.getCurrentOverall(),
        squad.getPotentialOverall(),
        squad.getCurrentMarketValue(),
        squad.getCurrentWage(),
        squad.getPreferredFoot(),
        squad.getCountry() != null ? squad.getCountry().getId() : null,
        squad.getCareerSquad().getId(),
        squad.getRole(),
        squad.getKitNumber());
  }
}
