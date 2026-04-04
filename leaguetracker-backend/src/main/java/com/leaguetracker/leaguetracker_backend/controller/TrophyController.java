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
    TrophyDetailsDTO createdTrophy = trophyService.createTrophy(data, authentication.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(createdTrophy);
  }

  @GetMapping("/career/{careerId}")
  public ResponseEntity<List<TrophyDetailsDTO>> listByCareer(
      @PathVariable Long careerId,
      Authentication authentication) {
    List<TrophyDetailsDTO> trophies = trophyService.findAllByCareer(careerId, authentication.getName());
    return ResponseEntity.ok(trophies);
  }

  @GetMapping("/season/{seasonId}")
  public ResponseEntity<List<TrophyDetailsDTO>> listBySeason(
      @PathVariable Long seasonId,
      Authentication authentication) {
    List<TrophyDetailsDTO> trophies = trophyService.findAllBySeason(seasonId, authentication.getName());
    return ResponseEntity.ok(trophies);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TrophyDetailsDTO> getById(
      @PathVariable Long id,
      Authentication authentication) {
    TrophyDetailsDTO trophy = trophyService.findByIdSecure(id, authentication.getName());
    return ResponseEntity.ok(trophy);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable Long id,
      Authentication authentication) {
    trophyService.deleteTrophy(id, authentication.getName());
    return ResponseEntity.noContent().build();
  }
}
