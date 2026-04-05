package com.leaguetracker.leaguetracker_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.entities.PlayerAward;
import com.leaguetracker.leaguetracker_backend.domain.entities.TeamTrophy;
import com.leaguetracker.leaguetracker_backend.domain.entities.Trophy;
import com.leaguetracker.leaguetracker_backend.dto.TrophyDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.TrophyRequestDTO;
import com.leaguetracker.leaguetracker_backend.service.TrophyService;

@RestController
@RequestMapping("/api/trophies")
public class TrophyController {

  @Autowired
  private TrophyService trophyService;

  @PostMapping
  public ResponseEntity<TrophyDetailsDTO> create(
      @RequestBody TrophyRequestDTO data,
      Authentication authentication) {
    Trophy createdTrophy = trophyService.createTrophy(data, authentication.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(createdTrophy));
  }

  @GetMapping("/career/{careerId}")
  public ResponseEntity<List<TrophyDetailsDTO>> listByCareer(
      @PathVariable Long careerId,
      Authentication authentication) {
    List<TrophyDetailsDTO> trophies = trophyService.findAllByCareer(careerId, authentication.getName()).stream()
        .map(this::convertToDTO)
        .toList();
    return ResponseEntity.ok(trophies);
  }

  @GetMapping("/season/{seasonId}")
  public ResponseEntity<List<TrophyDetailsDTO>> listBySeason(
      @PathVariable Long seasonId,
      Authentication authentication) {
    List<TrophyDetailsDTO> trophies = trophyService.findAllBySeason(seasonId, authentication.getName()).stream()
        .map(this::convertToDTO)
        .toList();
    return ResponseEntity.ok(trophies);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TrophyDetailsDTO> getById(
      @PathVariable Long id,
      Authentication authentication) {
    Trophy trophy = trophyService.findByIdSecure(id, authentication.getName());
    return ResponseEntity.ok(convertToDTO(trophy));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable Long id,
      Authentication authentication) {
    trophyService.deleteTrophy(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }

  private TrophyDetailsDTO convertToDTO(Trophy trophy) {
    if (trophy instanceof PlayerAward playerAward) {
      return new TrophyDetailsDTO(
          playerAward.getId(),
          "PLAYER",
          playerAward.getSeason() != null ? playerAward.getSeason().getId() : null,
          playerAward.getLeague() != null ? playerAward.getLeague().getId() : null,
          playerAward.getCareer() != null ? playerAward.getCareer().getId() : null,
          playerAward.getPlayer() != null ? playerAward.getPlayer().getId() : null,
          playerAward.getSquadPlayer() != null ? playerAward.getSquadPlayer().getId() : null,
          playerAward.getPlayerName(),
          playerAward.getAwardType(),
          playerAward.getGoalsCount(),
          playerAward.getAssistsCount(),
          null,
          null);
    }

    if (trophy instanceof TeamTrophy teamTrophy) {
      return new TrophyDetailsDTO(
          teamTrophy.getId(),
          "TEAM",
          teamTrophy.getSeason() != null ? teamTrophy.getSeason().getId() : null,
          teamTrophy.getLeague() != null ? teamTrophy.getLeague().getId() : null,
          teamTrophy.getCareer() != null ? teamTrophy.getCareer().getId() : null,
          null,
          null,
          null,
          null,
          null,
          null,
          teamTrophy.getIsWinner(),
          teamTrophy.getClassification());
    }

    return new TrophyDetailsDTO(
        trophy.getId(),
        "TROPHY",
        trophy.getSeason() != null ? trophy.getSeason().getId() : null,
        trophy.getLeague() != null ? trophy.getLeague().getId() : null,
        trophy.getCareer() != null ? trophy.getCareer().getId() : null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }
}
