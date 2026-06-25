package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.PlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.PlayerSearchDTO;
import com.leaguetracker.leaguetracker_backend.service.PlayerCatalogService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/catalog/players")
@RequiredArgsConstructor
public class PlayerController {

  private final PlayerCatalogService playerService;

  @GetMapping
  public ResponseEntity<Page<PlayerDTO>> searchPlayers(PlayerSearchDTO search,
      @PageableDefault(size = 20, sort = "fullName") Pageable pageable) {
    Page<PlayerDTO> players = playerService.search(search, pageable);
    return ResponseEntity.ok(players);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
    PlayerDTO player = playerService.getPlayerById(id);
    if (player != null) {
      return ResponseEntity.ok(player);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

}
