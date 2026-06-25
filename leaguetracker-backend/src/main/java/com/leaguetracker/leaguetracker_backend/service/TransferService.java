package com.leaguetracker.leaguetracker_backend.service;

import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.Club;
import com.leaguetracker.leaguetracker_backend.domain.entities.Season;
import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.entities.Transfer;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.TransferRequestDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.exception.ResourceNotFoundException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;
import com.leaguetracker.leaguetracker_backend.repository.SeasonRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.TransferRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransferService {

  private final TransferRepository transferRepository;
  private final CareerRepository careerRepository;
  private final SeasonRepository seasonRepository;
  private final ClubRepository clubRepository;
  private final SquadPlayerRepository squadPlayerRepository;
  private final SquadPlayerService squadPlayerService;

  @Transactional
  public Transfer createOrUpdate(TransferRequestDTO data, String username) {
    validateCareerOwnership(data.careerId(), username);

    Career career = findCareer(data.careerId());
    Season season = findSeason(data.seasonId());
    Club originClub = findClub(data.originClubId());
    Club destinationClub = findClub(data.destinationClubId());

    validateSeasonBelongsToCareer(season, career);

    Transfer transfer = buildTransfer(data);
    transfer.setOriginClub(originClub);
    transfer.setDestinationClub(destinationClub);

    return transfer;
  }

  private Transfer buildTransfer(TransferRequestDTO data) {
    Transfer transfer = (data.id() != null)
        ? transferRepository.findById(data.id()).orElse(new Transfer())
        : new Transfer();

    SquadPlayer squadPlayer = resolvePlayer(data.squadPlayerId(), data.newSquadPlayer());
    SquadPlayer playerSwap = resolvePlayer(data.playerSwapId(), data.newPlayerSwap());

    transfer.setScope(data.scope());
    transfer.setDirection(data.direction());
    transfer.setMethod(data.method());
    transfer.setFee(data.fee());
    transfer.setMarketValue(data.marketValue());

    transfer.setSquadPlayer(squadPlayer);
    transfer.setPlayerSwap(playerSwap);

    return transfer;
  }

  private Career findCareer(Long careerId) {
    return careerRepository.findById(careerId)
        .orElseThrow(() -> new ResourceNotFoundException("Carreira não encontrada."));
  }

  private Season findSeason(Long seasonId) {
    return seasonRepository.findById(seasonId)
        .orElseThrow(() -> new ResourceNotFoundException("Temporada não encontrada."));
  }

  private Club findClub(Long clubId) {
    return clubRepository.findById(clubId)
        .orElseThrow(() -> new ResourceNotFoundException("Clube não encontrado."));
  }

  private SquadPlayer findSquadPlayer(Long squadPlayerId) {
    return squadPlayerRepository.findById(squadPlayerId)
        .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado."));
  }

  private SquadPlayer resolvePlayer(Long playerId, SquadPlayerDTO playerDTO) {
    if (playerId != null) {
      return findSquadPlayer(playerId);
    }
    if (playerDTO != null) {
      return squadPlayerService.saveOrUpdate(playerDTO);
    }
    return null;
  }

  private void validateCareerOwnership(Long careerId, String username) {
    Career career = findCareer(careerId);

    if (!career.getUser().getEmail().equals(username)) {
      throw new AccessDeniedException("Acesso negado a esta carreira.");
    }
  }

  private void validateSeasonBelongsToCareer(Season season, Career career) {
    if (!season.getCareer().getId().equals(career.getId())) {
      throw new IllegalArgumentException("A temporada informada não pertence à carreira.");
    }
  }
}
