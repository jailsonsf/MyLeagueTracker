package com.leaguetracker.leaguetracker_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.Career;
import com.leaguetracker.leaguetracker_backend.domain.User;
import com.leaguetracker.leaguetracker_backend.dto.CareerDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDetailsDTO;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.UserRepository;

@Service
public class CareerService {

  @Autowired
  private CareerRepository careerRepository;

  @Autowired
  private UserRepository userRepository;

  public CareerDetailsDTO create(CareerDTO careerDTO, String username) {
    User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

    Career career = Career.builder()
        .user(user)
        .game(careerDTO.game())
        .manager(careerDTO.manager())
        .teamName(careerDTO.teamName())
        .build();

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
}
