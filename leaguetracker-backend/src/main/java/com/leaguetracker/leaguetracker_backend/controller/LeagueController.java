package com.leaguetracker.leaguetracker_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.entities.Country;
import com.leaguetracker.leaguetracker_backend.domain.entities.League;
import com.leaguetracker.leaguetracker_backend.dto.CountryDTO;
import com.leaguetracker.leaguetracker_backend.dto.LeagueDataDTO;
import com.leaguetracker.leaguetracker_backend.dto.LeagueInfoDTO;
import com.leaguetracker.leaguetracker_backend.repository.LeagueRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/leagues")
public class LeagueController {

  @Autowired
  private LeagueRepository leagueRepository;

  @GetMapping()
  public ResponseEntity<List<LeagueDataDTO>> getAllLeagues() {
    List<LeagueDataDTO> leagues = leagueRepository.findAll().stream()
        .map(this::convertLeagueDataDTO)
        .collect(Collectors.toList());

    return ResponseEntity.ok(leagues);
  }

  @GetMapping("/{id}")
  public ResponseEntity<LeagueDataDTO> getLeague(@PathVariable Long id) {
    League league = leagueRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Competição não encontrada!"));

    return ResponseEntity.ok(convertLeagueDataDTO(league));
  }

  @GetMapping("/country/{id}")
  private ResponseEntity<List<LeagueDataDTO>> getLeaguesByCountry(@PathVariable Long id) {
    List<LeagueDataDTO> leagues = leagueRepository.findByCountryId(id).stream()
        .map(this::convertLeagueDataDTO)
        .collect(Collectors.toList());

    return ResponseEntity.ok(leagues);
  }

  private LeagueDataDTO convertLeagueDataDTO(League league) {
    Country country = league.getCountry();
    CountryDTO countryDTO = new CountryDTO(
        country.getId(),
        country.getName(),
        country.getCode(),
        country.getFlag());

    LeagueInfoDTO leagueInfoDTO = new LeagueInfoDTO(
        league.getId(),
        league.getName(),
        league.getType(),
        league.getLogo(),
        country.getName());

    return new LeagueDataDTO(
        leagueInfoDTO,
        countryDTO);
  }
}
