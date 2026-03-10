package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.CareerSquad;
import com.leaguetracker.leaguetracker_backend.domain.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.YouthPlayer;
import com.leaguetracker.leaguetracker_backend.dto.YouthPlayerDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.repository.CareerSquadRepository;
import com.leaguetracker.leaguetracker_backend.repository.CountryRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.YouthPlayerRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class YouthPlayerService {

  @Autowired
  private YouthPlayerRepository youthPlayerRepository;

  @Autowired
  private SquadPlayerRepository squadPlayerRepository;

  @Autowired
  private CareerSquadRepository careerSquadRepository;

  @Autowired
  private CountryRepository countryRepository;

  public List<YouthPlayerDTO> findAllBySquad(Long careerSquadId, String username) {
    validateSquadOwnership(careerSquadId, username);

    return youthPlayerRepository.findByCareerSquadId(careerSquadId)
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public YouthPlayerDTO findById(Long id) {
    YouthPlayer youth = youthPlayerRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Jogador não encontrado"));

    return convertToDTO(youth);
  }

  @Transactional
  public YouthPlayerDTO saveOrUpdate(YouthPlayerDTO youthPlayerDTO) {
    YouthPlayer youth = (youthPlayerDTO.id() != null)
        ? youthPlayerRepository.findById(youthPlayerDTO.id()).orElse(new YouthPlayer())
        : new YouthPlayer();

    youth.setFullName(youthPlayerDTO.fullName());
    youth.setCurrentOverall(youthPlayerDTO.currentOverall());
    youth.setPotentialOverall(youthPlayerDTO.potentialOverall());
    youth.setCurrentMarketValue(youthPlayerDTO.currentMarketValue());
    youth.setDateOfBirth(youthPlayerDTO.dateOfBirth());
    youth.setPreferredFoot(youthPlayerDTO.preferredFoot());
    youth.setRole(youthPlayerDTO.role());

    if (youthPlayerDTO.countryId() != null) {
      youth.setCountry(countryRepository.findById(youthPlayerDTO.countryId()).orElse(null));
    }

    if (youthPlayerDTO.careerSquadId() != null) {
      youth.setCareerSquad(careerSquadRepository.findById(youthPlayerDTO.careerSquadId())
          .orElseThrow(() -> new EntityNotFoundException("Career Squad não encontrado")));
    }

    YouthPlayer saved = youthPlayerRepository.save(youth);

    return convertToDTO(saved);
  }

  @Transactional
  public void promoteToProfessional(Long youthId) {
    YouthPlayer youth = youthPlayerRepository.findById(youthId)
        .orElseThrow(() -> new EntityNotFoundException("Jovem não encontrado"));

    SquadPlayer player = SquadPlayer.promoteFromYouth(youth);

    squadPlayerRepository.save(player);

    youthPlayerRepository.delete(youth);

    log.info("Promoção realizada: {} agora faz parte do elenco principal", player.getDisplayName());
  }

  private void validateSquadOwnership(Long squadId, String userUsername) {
    CareerSquad squad = careerSquadRepository.findById(squadId)
        .orElseThrow(() -> new EntityNotFoundException("Squad não encontrado"));

    String ownerUsername = squad.getCareer().getUser().getUsername();

    if (!ownerUsername.equals(userUsername)) {
      log.warn("Tentativa de acesso não autorizado: Utilizador {} tentou aceder ao Squad {}", userUsername, squadId);
      throw new AccessDeniedException("Não tens permissão para aceder a esta carreira.");
    }
  }

  private YouthPlayerDTO convertToDTO(YouthPlayer youth) {
    return new YouthPlayerDTO(
        youth.getId(),
        youth.getFullName(),
        youth.getCurrentOverall(),
        youth.getPotentialOverall(),
        youth.getCurrentMarketValue(),
        youth.getDateOfBirth(),
        youth.getPreferredFoot(),
        youth.getCountry() != null ? youth.getCountry().getId() : null,
        youth.getCareerSquad().getId(),
        youth.getRole());
  }
}
