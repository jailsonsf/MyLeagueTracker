package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.service.SquadPlayerService;

@RestController
@RequestMapping("/api/squad/players")
public class Player {

  @Autowired
  private SquadPlayerService squadPlayerService;

  @PostMapping()
  public ResponseEntity<SquadPlayerDTO> createOrUpdate(@RequestBody SquadPlayerDTO squadPlayerDTO) {
    return ResponseEntity.ok(squadPlayerService.saveOrUpdate(squadPlayerDTO));
  }
}
