package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.Season;
import com.leaguetracker.leaguetracker_backend.dto.SeasonDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.SeasonRequestDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.exception.ResourceNotFoundException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.SeasonRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonService {

  private final CareerRepository careerRepository;
  private final SeasonRepository seasonRepository;

  @Transactional
  public SeasonDetailsDTO createSeason(SeasonRequestDTO data, String username) {
    Career career = careerRepository.findById(data.careerId())
        .orElseThrow(() -> new RuntimeException("Carreira não encontrada."));

    validateCareerOwnership(data.careerId(), username);

    Season season = Season.builder()
        .startYear(data.startYear())
        .endYear(data.endYear())
        .career(career)
        .build();

    seasonRepository.save(season);

    return new SeasonDetailsDTO(
        season.getId(),
        season.getStartYear(),
        season.getEndYear(),
        season.getCareer().getId());
  }

  public List<SeasonDetailsDTO> findAllByCareer(Long careerId, String username) {
    validateCareerOwnership(careerId, username);

    List<Season> seasons = seasonRepository.findByCareerId(careerId);

    return seasons.stream()
        .map(season -> new SeasonDetailsDTO(
            season.getId(),
            season.getStartYear(),
            season.getEndYear(),
            season.getCareer().getId()))
        .toList();
  }

  public SeasonDetailsDTO findByIdSecure(Long seasonId, String username) {
    Season season = seasonRepository.findById(seasonId)
        .orElseThrow(() -> new ResourceNotFoundException("Temporada não encontrada."));

    validateCareerOwnership(season.getCareer().getId(), username);
    return new SeasonDetailsDTO(
        season.getId(),
        season.getStartYear(),
        season.getEndYear(),
        season.getCareer().getId());
  }

  @Transactional
  public void deleteSeason(Long seasonId, String username) {
    Season season = seasonRepository.findById(seasonId)
        .orElseThrow(() -> new ResourceNotFoundException("Temporada não encontrada."));

    validateCareerOwnership(season.getCareer().getId(), username);
    seasonRepository.delete(season);
  }

  private void validateCareerOwnership(Long careerId, String username) {
    Career career = careerRepository.findById(careerId)
        .orElseThrow(() -> new ResourceNotFoundException("Carreira não encontrada."));

    if (!career.getUser().getEmail().equals(username)) {
      throw new AccessDeniedException("Acesso negado a esta carreira.");
    }
  }
}
