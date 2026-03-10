package com.leaguetracker.leaguetracker_backend.domain;

import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "youth_players")
@Getter
@Setter
public class YouthPlayer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String fullName;
  private int overall;
  private int currentOverall;
  private int potentialOverall;
  private long currentMarketValue;
  private long currentWage;
  private int heightCm;
  private int weightKg;
  private LocalDate dateOfBirth;
  private boolean promotedToSquad;
  private Integer kitNumber;

  @Enumerated(EnumType.STRING)
  private PreferredFoot preferredFoot;

  @ManyToOne
  @JoinColumn(name = "country_id")
  private Country country;

  @Enumerated(EnumType.STRING)
  @Column(name = "player_role")
  private PlayerRole role;

  @ManyToOne
  @JoinColumn(name = "career_squad_id", nullable = false)
  private CareerSquad careerSquad;

  public int getAgeInSeason(LocalDate seasonStartDate) {
    return Period.between(dateOfBirth, seasonStartDate).getYears();
  }
}
