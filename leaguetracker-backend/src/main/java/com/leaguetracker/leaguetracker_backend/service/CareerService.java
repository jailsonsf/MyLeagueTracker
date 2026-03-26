package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.CareerSquad;
import com.leaguetracker.leaguetracker_backend.domain.entities.Club;
import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;
import com.leaguetracker.leaguetracker_backend.domain.entities.User;
import com.leaguetracker.leaguetracker_backend.dto.CareerDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDashboardDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDetailsDTO;
import com.leaguetracker.leaguetracker_backend.dto.SquadPlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.YouthPlayerDTO;
import com.leaguetracker.leaguetracker_backend.exception.AccessDeniedException;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;
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

  @Autowired
  private ClubRepository clubRepository;

  public CareerDetailsDTO create(CareerDTO careerDTO, String username) {
    User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

    Club club = null;
    if (careerDTO.clubId() != null) {
      club = clubRepository.findById(careerDTO.clubId())
        .orElseThrow(() -> new RuntimeException("Club not found"));
    }

    Career career = Career.builder()
        .user(user)
        .club(club)
        .game(careerDTO.game())
        .manager(careerDTO.manager())
        .teamName(careerDTO.teamName())
        .budget(careerDTO.budget())
        .build();

    CareerSquad squad = new CareerSquad();
    squad.setCareer(career);

    career.setSquad(squad);

    Career savedCareer = careerRepository.save(career);

    String teamName = (savedCareer.getClub() != null) 
                           ? savedCareer.getClub().getName() 
                           : savedCareer.getTeamName();

    String teamLogo = (savedCareer.getClub() != null) 
                           ? savedCareer.getClub().getLogo()
                           : savedCareer.getTeamLogo();

    return new CareerDetailsDTO(
        savedCareer.getId(),
        savedCareer.getGame(),
        savedCareer.getManager(),
        teamName,
        teamLogo,
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
        player.getImage(),
        player.getAge(),
        player.getYearJoinedClub(),
        player.getStartingOverall(),
        player.getCurrentOverall(),
        player.getPotentialOverall(),
        player.getCurrentMarketValue(),
        player.getCurrentWage(),
        player.getPreferredFoot(),
        player.getCountryId(),
        player.getCareerSquad().getId(),
        player.getRole(),
        player.getKitNumber());
  }
}
