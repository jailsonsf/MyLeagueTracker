package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.entities.Club;
import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.entities.Transfer;
import com.leaguetracker.leaguetracker_backend.dto.ClubDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.TransferDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.TransferRequestDTO;
import com.leaguetracker.leaguetracker_backend.service.TransferService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/transfer")
@RequiredArgsConstructor
public class TransferController {

  private final TransferService transferService;

  @PostMapping()
  public ResponseEntity<TransferDetailsDTO> createOrUpdate(
      @RequestBody TransferRequestDTO data,
      Authentication authentication) {
    Transfer createdTransfer = transferService.createOrUpdate(data, authentication.getName());

    return ResponseEntity.status(HttpStatus.CREATED).body(convertToTransferDetailsDTO(createdTransfer));
  }

  private TransferDetailsDTO convertToTransferDetailsDTO(Transfer transfer) {
    return new TransferDetailsDTO(
        transfer.getId(),
        transfer.getCareer().getId(),
        transfer.getSeason().getId(),
        transfer.getSeason().getSeasonName(),
        transfer.getScope(),
        transfer.getDirection(),
        transfer.getMethod(),
        convertTSquadPlayerDTO(transfer.getSquadPlayer()),
        convertTSquadPlayerDTO(transfer.getPlayerSwap()),
        convertToClubDetailsDTO(transfer.getOriginClub()),
        convertToClubDetailsDTO(transfer.getDestinationClub()),
        transfer.getFee(),
        transfer.getMarketValue());
  }

  private SquadPlayerDTO convertTSquadPlayerDTO(SquadPlayer player) {
    return new SquadPlayerDTO(
        player.getId(),
        player.getFullName(),
        player.getImage(),
        player.getAge(),
        player.getYearJoinedClub(),
        player.getStartingOverall(),
        player.getCurrentOverall(),
        player.getPotentialOverall(),
        player.getCurrentMarketValue(),
        player.getCurrentWage(),
        player.getPreferredFoot(),
        player.getCountry() != null ? player.getCountry().getId() : null,
        player.getCareerSquad().getId(),
        player.getRole(),
        player.getKitNumber());
  }

  private ClubDetailsDTO convertToClubDetailsDTO(Club club) {
    return new ClubDetailsDTO(
        club.getId(),
        club.getName(),
        club.getLogo(),
        club.getClubRating());
  }
}
