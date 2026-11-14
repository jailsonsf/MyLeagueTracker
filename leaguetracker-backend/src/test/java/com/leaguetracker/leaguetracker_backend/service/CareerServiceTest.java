package com.leaguetracker.leaguetracker_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;
import com.leaguetracker.leaguetracker_backend.domain.entities.CareerSquad;
import com.leaguetracker.leaguetracker_backend.domain.entities.User;
import com.leaguetracker.leaguetracker_backend.domain.enums.GameTitle;
import com.leaguetracker.leaguetracker_backend.dto.CareerDashboardDTO;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;
import com.leaguetracker.leaguetracker_backend.repository.SquadPlayerRepository;
import com.leaguetracker.leaguetracker_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CareerServiceTest {

  @Mock
  private CareerRepository careerRepository;

  @Mock
  private UserRepository userRepository;

  @Mock
  private SquadPlayerRepository squadPlayerRepository;

  @Mock
  private YouthPlayerService youthPlayerService;

  @Mock
  private ClubRepository clubRepository;

  @InjectMocks
  private CareerService careerService;

  @Test
  void dashboardExposesTheCareerSquadId() {
    CareerSquad squad = new CareerSquad();
    squad.setId(42L);

    Career career = Career.builder()
        .id(7L)
        .user(User.builder().username("boss").build())
        .game(GameTitle.EA_FC_25)
        .manager("Ana")
        .teamName("FC Test")
        .squad(squad)
        .build();

    when(careerRepository.findById(7L)).thenReturn(Optional.of(career));
    when(squadPlayerRepository.findByCareerSquadId(42L)).thenReturn(List.of());
    when(youthPlayerService.findAllBySquad(42L, "boss")).thenReturn(List.of());

    CareerDashboardDTO dashboard = careerService.getFullDashboard(7L, "boss");

    assertThat(dashboard.careerSquadId()).isEqualTo(42L);
  }
}
