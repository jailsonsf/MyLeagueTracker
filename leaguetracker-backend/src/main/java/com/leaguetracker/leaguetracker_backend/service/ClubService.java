package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.Club;
import com.leaguetracker.leaguetracker_backend.domain.Player;
import com.leaguetracker.leaguetracker_backend.dto.ClubDTO;
import com.leaguetracker.leaguetracker_backend.dto.PlayerDTO;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClubService {

  @Autowired
  private ClubRepository clubRepository;

  public List<ClubDTO> getAllClubs() {
    return clubRepository.findAll().stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public ClubDTO getClub(Long id) {
    Club club = clubRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Clube não encontrado"));

    return convertToDTO(club);
  }

  private ClubDTO convertToDTO(Club club) {
    List<PlayerDTO> playerDTOs = club.getPlayers().stream()
        .map(this::convertToPlayerDTO)
        .toList();

    return new ClubDTO(
        club.getId(),
        club.getExternalId(),
        club.getName(),
        club.getLogo(),
        club.getClubRating(),
        playerDTOs);
  }

  private PlayerDTO convertToPlayerDTO(Player player) {
    return new PlayerDTO(
        player.getId(),
        player.getExternalId(),
        player.getFullName(),
        player.getDateOfBirth(),
        player.getOverall(),
        player.getPotential(),
        player.getPositions(),
        player.getPreferredFoot(),
        player.getValue(),
        player.getWage(),
        player.getImage(),
        player.getHeightCm(),
        player.getWeightKg(),
        player.getKitNumber());
  }
}
