package com.leaguetracker.leaguetracker_backend.domain;

import java.time.Period;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_players")
@Getter
@Setter
public class CareerPlayer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "career_id", nullable = false)
  private Career career;

  @ManyToOne
  @JoinColumn(name = "player_id", nullable = false)
  private Player player;

  private int currentOverall;
  private long currentMarketValue;
  private long currentWage;

  @Enumerated(EnumType.STRING)
  @Column(name = "player_role")
  private Role role;

  public int getAgeInCareer() {
    if (player.getDateOfBirth() == null || career.getStartDate() == null) {
      return 0;
    }

    return Period.between(player.getDateOfBirth(), career.getStartDate()).getYears();
  }
}
