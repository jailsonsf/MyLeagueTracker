package com.leaguetracker.leaguetracker_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.YouthPlayerDTO;
import com.leaguetracker.leaguetracker_backend.service.YouthPlayerService;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@RestController
@RequestMapping("/api/squad/youth-players")
public class YouthPlayerController {

  @Autowired
  private YouthPlayerService youthPlayerService;

  @GetMapping()
  public ResponseEntity<List<YouthPlayerDTO>> listAll(
      @RequestParam Long careerId,
      @AuthenticationPrincipal UserDetails userDetails) {
    String username = userDetails.getUsername();
    List<YouthPlayerDTO> players = youthPlayerService.findAllBySquad(careerId, username);
    return ResponseEntity.ok(players);
  }

  @GetMapping("/{id}")
  public ResponseEntity<YouthPlayerDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(youthPlayerService.findById(id));
  }

  @PostMapping()
  public ResponseEntity<YouthPlayerDTO> createOrUpdate(@RequestBody YouthPlayerDTO youthPlayerDTO) {
    return ResponseEntity.ok(youthPlayerService.saveOrUpdate(youthPlayerDTO));
  }

  @PostMapping("/{id}/promote")
  public ResponseEntity<String> promoteYouth(@PathVariable Long id) {
    log.info("Requisição recebida para promover YouthPlayer ID: {}", id);

    try {
      youthPlayerService.promoteToProfessional(id);
      return ResponseEntity.ok("Jogador promovido com sucesso ao elenco principal!");
    } catch (EntityNotFoundException e) {
      log.error("Erro ao promover: Jogador não encontrado");
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      log.error("Erro interno ao processar promoção: {}", e.getMessage());
      return ResponseEntity.internalServerError().body("Erro ao processar promoção");
    }
  }

}
