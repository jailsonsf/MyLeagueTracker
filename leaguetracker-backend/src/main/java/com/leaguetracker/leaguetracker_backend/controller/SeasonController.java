package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.SeasonDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.SeasonRequestDTO;
import com.leaguetracker.leaguetracker_backend.service.SeasonService;

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

@RestController
@RequestMapping("/api/season")
public class SeasonController {

  @Autowired
  private SeasonService seasonService;

  @PostMapping
  public ResponseEntity<SeasonDetailsDTO> create(
      @RequestBody SeasonRequestDTO data,
      Authentication authentication) {
    SeasonDetailsDTO newSeason = seasonService.createSeason(data, authentication.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(newSeason);
  }

  @GetMapping("/career/{careerId}")
  public ResponseEntity<List<SeasonDetailsDTO>> listByCareer(
      @PathVariable Long careerId,
      Authentication authentication) {
    List<SeasonDetailsDTO> seasons = seasonService.findAllByCareer(careerId, authentication.getName());
    return ResponseEntity.ok(seasons);
  }

  @GetMapping("/{id}")
  public ResponseEntity<SeasonDetailsDTO> getById(
      @PathVariable Long id,
      Authentication authentication) {
    SeasonDetailsDTO season = seasonService.findByIdSecure(id, authentication.getName());
    return ResponseEntity.ok(season);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable Long seasonId,
      Authentication authentication) {
    seasonService.deleteSeason(seasonId, authentication.getName());

    return ResponseEntity.noContent().build();
  }
}
