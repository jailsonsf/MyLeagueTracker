package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.League;
import com.leaguetracker.leaguetracker_backend.domain.entities.Player;
import com.leaguetracker.leaguetracker_backend.domain.entities.PlayerAward;
import com.leaguetracker.leaguetracker_backend.domain.entities.Season;
import com.leaguetracker.leaguetracker_backend.domain.entities.TeamTrophy;
import com.leaguetracker.leaguetracker_backend.domain.entities.Trophy;
import com.leaguetracker.leaguetracker_backend.dto.TrophyDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.TrophyRequestDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.exception.ResourceNotFoundException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.LeagueRepository;
import com.leaguetracker.leaguetracker_backend.repository.PlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.SeasonRepository;
import com.leaguetracker.leaguetracker_backend.repository.TrophyRepository;

import jakarta.transaction.Transactional;

@Service
public class TrophyService {

  @Autowired
  private TrophyRepository trophyRepository;

  @Autowired
  private CareerRepository careerRepository;

  @Autowired
  private SeasonRepository seasonRepository;

  @Autowired
  private LeagueRepository leagueRepository;

  @Autowired
  private PlayerRepository playerRepository;

  @Transactional
  public TrophyDetailsDTO createTrophy(TrophyRequestDTO data, String username) {
    validateCareerOwnership(data.careerId(), username);

    Career career = findCareer(data.careerId());
    Season season = findSeason(data.seasonId());
    League league = findLeague(data.leagueId());

    validateSeasonBelongsToCareer(season, career);

    Trophy trophy = buildTrophy(data);
    trophy.setCareer(career);
    trophy.setSeason(season);
    trophy.setLeague(league);

    trophyRepository.save(trophy);

    return convertToDTO(trophy);
  }

  public List<TrophyDetailsDTO> findAllByCareer(Long careerId, String username) {
    validateCareerOwnership(careerId, username);

    return trophyRepository.findByCareerId(careerId).stream()
        .map(this::convertToDTO)
        .toList();
  }

  public List<TrophyDetailsDTO> findAllBySeason(Long seasonId, String username) {
    Season season = findSeason(seasonId);
    validateCareerOwnership(season.getCareer().getId(), username);

    return trophyRepository.findBySeasonId(seasonId).stream()
        .map(this::convertToDTO)
        .toList();
  }

  public TrophyDetailsDTO findByIdSecure(Long trophyId, String username) {
    Trophy trophy = findTrophy(trophyId);
    validateCareerOwnership(trophy.getCareer().getId(), username);
    return convertToDTO(trophy);
  }

  @Transactional
  public void deleteTrophy(Long trophyId, String username) {
    Trophy trophy = findTrophy(trophyId);
    validateCareerOwnership(trophy.getCareer().getId(), username);
    trophyRepository.delete(trophy);
  }

  private Trophy buildTrophy(TrophyRequestDTO data) {
    String normalizedCategory = normalizeCategory(data.category());

    if ("PLAYER".equals(normalizedCategory)) {
      PlayerAward playerAward = new PlayerAward();
      playerAward.setPlayer(findPlayerIfPresent(data.playerId()));
      playerAward.setPlayerName(data.playerName());
      playerAward.setAwardType(data.awardType());
      playerAward.setGoalsCount(data.goalsCount());
      playerAward.setAssistsCount(data.assistsCount());
      return playerAward;
    }

    if ("TEAM".equals(normalizedCategory)) {
      TeamTrophy teamTrophy = new TeamTrophy();
      teamTrophy.setIsWinner(data.isWinner());
      teamTrophy.setClassification(data.classification());
      return teamTrophy;
    }

    throw new IllegalArgumentException("Categoria de troféu inválida. Use PLAYER ou TEAM.");
  }

  private TrophyDetailsDTO convertToDTO(Trophy trophy) {
    if (trophy instanceof PlayerAward playerAward) {
      return new TrophyDetailsDTO(
          playerAward.getId(),
          "PLAYER",
          playerAward.getSeason() != null ? playerAward.getSeason().getId() : null,
          playerAward.getLeague() != null ? playerAward.getLeague().getId() : null,
          playerAward.getCareer() != null ? playerAward.getCareer().getId() : null,
          playerAward.getPlayer() != null ? playerAward.getPlayer().getId() : null,
          playerAward.getPlayerName(),
          playerAward.getAwardType(),
          playerAward.getGoalsCount(),
          playerAward.getAssistsCount(),
          null,
          null);
    }

    if (trophy instanceof TeamTrophy teamTrophy) {
      return new TrophyDetailsDTO(
          teamTrophy.getId(),
          "TEAM",
          teamTrophy.getSeason() != null ? teamTrophy.getSeason().getId() : null,
          teamTrophy.getLeague() != null ? teamTrophy.getLeague().getId() : null,
          teamTrophy.getCareer() != null ? teamTrophy.getCareer().getId() : null,
          null,
          null,
          null,
          null,
          null,
          teamTrophy.getIsWinner(),
          teamTrophy.getClassification());
    }

    return new TrophyDetailsDTO(
        trophy.getId(),
        "TROPHY",
        trophy.getSeason() != null ? trophy.getSeason().getId() : null,
        trophy.getLeague() != null ? trophy.getLeague().getId() : null,
        trophy.getCareer() != null ? trophy.getCareer().getId() : null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  private String normalizeCategory(String category) {
    if (category == null || category.isBlank()) {
      throw new IllegalArgumentException("A categoria do troféu é obrigatória.");
    }

    return category.trim().toUpperCase();
  }

  private Trophy findTrophy(Long trophyId) {
    return trophyRepository.findById(trophyId)
        .orElseThrow(() -> new ResourceNotFoundException("Troféu não encontrado."));
  }

  private Career findCareer(Long careerId) {
    return careerRepository.findById(careerId)
        .orElseThrow(() -> new ResourceNotFoundException("Carreira não encontrada."));
  }

  private Season findSeason(Long seasonId) {
    return seasonRepository.findById(seasonId)
        .orElseThrow(() -> new ResourceNotFoundException("Temporada não encontrada."));
  }

  private League findLeague(Long leagueId) {
    return leagueRepository.findById(leagueId)
        .orElseThrow(() -> new ResourceNotFoundException("Liga não encontrada."));
  }

  private Player findPlayerIfPresent(Long playerId) {
    if (playerId == null) {
      return null;
    }

    return playerRepository.findById(playerId)
        .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado."));
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
