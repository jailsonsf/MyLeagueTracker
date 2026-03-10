package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.Career;
import com.leaguetracker.leaguetracker_backend.domain.CareerSquad;
import com.leaguetracker.leaguetracker_backend.domain.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.User;
import com.leaguetracker.leaguetracker_backend.dto.CareerDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDashboardDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.YouthPlayerDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CareerService {

  @Autowired
  private CareerRepository careerRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SquadPlayerRepository squadPlayerRepository;

  @Autowired
  private YouthPlayerService youthPlayerService;

  public CareerDetailsDTO create(CareerDTO careerDTO, String username) {
    User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

    Career career = Career.builder()
        .user(user)
        .game(careerDTO.game())
        .manager(careerDTO.manager())
        .teamName(careerDTO.teamName())
        .build();

    CareerSquad squad = new CareerSquad();
    squad.setCareer(career);

    career.setSquad(squad);

    Career savedCareer = careerRepository.save(career);

    return new CareerDetailsDTO(
        savedCareer.getId(),
        savedCareer.getGame(),
        savedCareer.getManager(),
        savedCareer.getTeamName(),
        savedCareer.getTeamLogo(),
        savedCareer.getStartDate(),
        savedCareer.getBudget());
  }

  public List<CareerDetailsDTO> getCareersForUser(String username) {
    List<Career> careers = careerRepository.findByUser_Username(username);

    return careers.stream()
        .map(career -> new CareerDetailsDTO(
            career.getId(),
            career.getGame(),
            career.getManager(),
            career.getTeamName(),
            career.getTeamLogo(),
            career.getStartDate(),
            career.getBudget()))
        .toList();
  }

  public CareerDashboardDTO getFullDashboard(Long careerId, String currentUser) {
    Career career = careerRepository.findById(careerId)
        .orElseThrow(() -> new EntityNotFoundException("Carreira não encontrada"));

    String ownerUsername = career.getUser().getUsername();

    if (!ownerUsername.equals(currentUser)) {
      throw new AccessDeniedException("Você não tem permissão para ver esta carreira.");
    }

    CareerDetailsDTO careerInfo = new CareerDetailsDTO(
        career.getId(),
        career.getGame(),
        career.getManager(),
        career.getTeamName(),
        career.getTeamLogo(),
        career.getStartDate(),
        career.getBudget());

    List<SquadPlayerDTO> principalSquad = squadPlayerRepository.findByCareerSquadId(career.getSquad().getId())
        .stream()
        .map(this::convertToSquadDTO)
        .toList();

    List<YouthPlayerDTO> youthSquad = youthPlayerService.findAllBySquad(career.getSquad().getId(), currentUser);

    return new CareerDashboardDTO(careerInfo, principalSquad, youthSquad);
  }

  private SquadPlayerDTO convertToSquadDTO(SquadPlayer player) {
    return new SquadPlayerDTO(
        player.getId(),
        player.getFullName(),
        player.getCurrentOverall(),
        player.getPotentialOverall(),
        player.getCurrentMarketValue(),
        player.getBirthDate(),
        player.getPreferredFoot(),
        player.getCountryId(),
        player.getCareerSquad().getId(),
        player.getRole());
  }
}
