package com.leaguetracker.leaguetracker_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.repository.CareerSquadRepository;
import com.leaguetracker.leaguetracker_backend.repository.CountryRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class SquadPlayerService {

  @Autowired
  private SquadPlayerRepository squadPlayerRepository;

  @Autowired
  private CareerSquadRepository careerSquadRepository;

  @Autowired
  private CountryRepository countryRepository;

  @Transactional
  public SquadPlayerDTO saveOrUpdate(SquadPlayerDTO squadPlayerDTO) {
    SquadPlayer squadPlayer = (squadPlayerDTO.id() != null)
        ? squadPlayerRepository.findById(squadPlayerDTO.id()).orElse(new SquadPlayer())
        : new SquadPlayer();

    squadPlayer.setFullName(squadPlayerDTO.fullName());
    squadPlayer.setCurrentOverall(squadPlayerDTO.currentOverall());
    squadPlayer.setPotentialOverall(squadPlayerDTO.potentialOverall());
    squadPlayer.setCurrentMarketValue(squadPlayerDTO.currentMarketValue());
    squadPlayer.setAge(squadPlayerDTO.age());
    squadPlayer.setYearJoinedClub(squadPlayerDTO.yearJoinedClub());
    squadPlayer.setPreferredFoot(squadPlayerDTO.preferredFoot());
    squadPlayer.setRole(squadPlayerDTO.role());

    if (squadPlayerDTO.countryId() != null) {
      squadPlayer.setCountry(countryRepository.findById(squadPlayerDTO.countryId()).orElse(null));
    }

    if (squadPlayerDTO.careerSquadId() != null) {
      squadPlayer.setCareerSquad(careerSquadRepository.findById(squadPlayerDTO.careerSquadId())
          .orElseThrow(() -> new EntityNotFoundException("Career Squad não encontrado")));
    }

    SquadPlayer saved = squadPlayerRepository.save(squadPlayer);

    return convertToDTO(saved);
  }

  private SquadPlayerDTO convertToDTO(SquadPlayer squad) {
    return new SquadPlayerDTO(
        squad.getId(),
        squad.getFullName(),
        squad.getCurrentOverall(),
        squad.getPotentialOverall(),
        squad.getCurrentMarketValue(),
        squad.getAge(),
        squad.getYearJoinedClub(),
        squad.getPreferredFoot(),
        squad.getCountry() != null ? squad.getCountry().getId() : null,
        squad.getCareerSquad().getId(),
        squad.getRole());
  }
}
