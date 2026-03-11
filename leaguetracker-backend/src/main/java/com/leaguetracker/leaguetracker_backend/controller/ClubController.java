package com.leaguetracker.leaguetracker_backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.ClubDTO;
import com.leaguetracker.leaguetracker_backend.service.ClubService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

  @Autowired
  private ClubService clubService;

  @GetMapping
  public ResponseEntity<List<ClubDTO>> getAllClubs() {
    return ResponseEntity.ok(clubService.getAllClubs());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ClubDTO> getClubDetails(@PathVariable Long id) {
    return ResponseEntity.ok(clubService.getClub(id));
  }
}
