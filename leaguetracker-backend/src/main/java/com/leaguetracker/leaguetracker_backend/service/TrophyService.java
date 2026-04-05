package com.leaguetracker.leaguetracker_backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.League;
import com.leaguetracker.leaguetracker_backend.domain.entities.Player;
import com.leaguetracker.leaguetracker_backend.domain.entities.PlayerAward;
import com.leaguetracker.leaguetracker_backend.domain.entities.Season;
import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.entities.TeamTrophy;
import com.leaguetracker.leaguetracker_backend.domain.entities.Trophy;
import com.leaguetracker.leaguetracker_backend.dto.TrophyRequestDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.exception.ResourceNotFoundException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.LeagueRepository;
import com.leaguetracker.leaguetracker_backend.repository.PlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.SeasonRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;
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

  @Autowired
  private SquadPlayerRepository squadPlayerRepository;

  @Transactional
  public Trophy createTrophy(TrophyRequestDTO data, String username) {
    validateCareerOwnership(data.careerId(), username);

    Career career = findCareer(data.careerId());
    Season season = findSeason(data.seasonId());
    League league = findLeague(data.leagueId());

    validateSeasonBelongsToCareer(season, career);

    Trophy trophy = buildTrophy(data, career);
    trophy.setCareer(career);
    trophy.setSeason(season);
    trophy.setLeague(league);

    return trophyRepository.save(trophy);
  }

  public List<Trophy> findAllByCareer(Long careerId, String username) {
    validateCareerOwnership(careerId, username);

    return trophyRepository.findByCareerId(careerId);
  }

  public List<Trophy> findAllBySeason(Long seasonId, String username) {
    Season season = findSeason(seasonId);
    validateCareerOwnership(season.getCareer().getId(), username);

    return trophyRepository.findBySeasonId(seasonId);
  }

  public Trophy findByIdSecure(Long trophyId, String username) {
    Trophy trophy = findTrophy(trophyId);
    validateCareerOwnership(trophy.getCareer().getId(), username);
    return trophy;
  }

  @Transactional
  public void deleteTrophy(Long trophyId, String username) {
    Trophy trophy = findTrophy(trophyId);
    validateCareerOwnership(trophy.getCareer().getId(), username);
    trophyRepository.delete(trophy);
  }

  private Trophy buildTrophy(TrophyRequestDTO data, Career career) {
    String normalizedCategory = normalizeCategory(data.category());

    if ("PLAYER".equals(normalizedCategory)) {
      PlayerAward playerAward = new PlayerAward();
      Player player = findPlayerIfPresent(data.playerId());
      SquadPlayer squadPlayer = resolveSquadPlayer(data, career, player);
      playerAward.setPlayer(player != null ? player : squadPlayer != null ? squadPlayer.getPlayerInfo() : null);
      playerAward.setSquadPlayer(squadPlayer);
      playerAward.setPlayerName(resolvePlayerName(data.playerName(), squadPlayer, player));
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

  private SquadPlayer resolveSquadPlayer(TrophyRequestDTO data, Career career, Player player) {
    if (data.squadPlayerId() != null) {
      return findSquadPlayerFromCareer(data.squadPlayerId(), career);
    }

    if (player != null) {
      return findOrCreateSquadPlayer(career, player);
    }

    return null;
  }

  private SquadPlayer findSquadPlayerFromCareer(Long squadPlayerId, Career career) {
    SquadPlayer squadPlayer = squadPlayerRepository.findById(squadPlayerId)
        .orElseThrow(() -> new ResourceNotFoundException("Jogador do elenco não encontrado."));

    if (squadPlayer.getCareerSquad() == null
        || squadPlayer.getCareerSquad().getCareer() == null
        || !squadPlayer.getCareerSquad().getCareer().getId().equals(career.getId())) {
      throw new IllegalArgumentException("O jogador informado não pertence ao elenco da carreira.");
    }

    return squadPlayer;
  }

  private SquadPlayer findOrCreateSquadPlayer(Career career, Player player) {
    if (career.getSquad() == null) {
      throw new IllegalArgumentException("A carreira informada não possui elenco cadastrado.");
    }

    return squadPlayerRepository.findByCareerSquadIdAndPlayerInfoId(career.getSquad().getId(), player.getId())
        .orElseGet(() -> squadPlayerRepository.save(buildSquadPlayerFromCatalog(career, player)));
  }

  private SquadPlayer buildSquadPlayerFromCatalog(Career career, Player player) {
    int age = 0;
    if (player.getDateOfBirth() != null) {
      age = player.getDateOfBirth().until(LocalDate.now()).getYears();
    }

    SquadPlayer squadPlayer = new SquadPlayer();
    squadPlayer.setPlayerInfo(player);
    squadPlayer.setCountry(player.getCountry());
    squadPlayer.setCareerSquad(career.getSquad());
    squadPlayer.setFullName(player.getFullName());
    squadPlayer.setImage(player.getImage());
    squadPlayer.setAge(age);
    squadPlayer.setYearJoinedClub(career.getStartDate() != null ? career.getStartDate().getYear() : LocalDate.now().getYear());
    squadPlayer.setStartingOverall(player.getOverall());
    squadPlayer.setCurrentOverall(player.getOverall());
    squadPlayer.setPotentialOverall(player.getPotential());
    squadPlayer.setCurrentMarketValue(player.getValue() != null ? player.getValue() : 0L);
    squadPlayer.setCurrentWage(player.getWage() != null ? player.getWage() : 0L);
    squadPlayer.setKitNumber(player.getKitNumber());
    squadPlayer.setIsYouthPlayer(false);
    squadPlayer.setPreferredFoot(player.getPreferredFoot());
    return squadPlayer;
  }

  private String resolvePlayerName(String requestedPlayerName, SquadPlayer squadPlayer, Player player) {
    if (requestedPlayerName != null && !requestedPlayerName.isBlank()) {
      return requestedPlayerName;
    }

    if (squadPlayer != null) {
      return squadPlayer.getDisplayName();
    }

    return player != null ? player.getFullName() : null;
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
