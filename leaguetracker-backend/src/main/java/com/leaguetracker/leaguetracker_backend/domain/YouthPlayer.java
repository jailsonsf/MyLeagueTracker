package com.leaguetracker.leaguetracker_backend.domain;

import java.time.LocalDate;

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
  private int startingOverall;
  private int currentOverall;
  private int potentialOverall;
  private long currentMarketValue;
  private long currentWage;
  private String image;
  private int heightCm;
  private int weightKg;
  private int age;
  private int yearJoinedClub;
  private int kitNumber;

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
    int sumYear = seasonStartDate.getYear() - this.yearJoinedClub;
    return this.age + sumYear;
  }
}
