package com.leaguetracker.leaguetracker_backend.domain;

import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "squad_players")
@Getter
@Setter
public class SquadPlayer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "player_catalog_id", nullable = false)
  private Player playerInfo;

  @ManyToOne
  @JoinColumn(name = "career_squad_id", nullable = false)
  private CareerSquad careerSquad;

  private int currentOverall;
  private long currentMarketValue;
  private long currentWage;

  @Enumerated(EnumType.STRING)
  @Column(name = "player_role")
  private PlayerRole role;

  public int getAgeInSeason(LocalDate seasonStartDate) {
    return Period.between(playerInfo.getDateOfBirth(), seasonStartDate).getYears();
  }
}
