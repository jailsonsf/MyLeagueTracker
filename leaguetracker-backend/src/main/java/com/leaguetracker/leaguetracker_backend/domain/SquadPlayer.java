package com.leaguetracker.leaguetracker_backend.domain;

import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "squad_players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SquadPlayer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "player_catalog_id", nullable = true)
  private Player playerInfo;

  @ManyToOne
  @JoinColumn(name = "country_id")
  private Country country;

  @ManyToOne
  @JoinColumn(name = "career_squad_id", nullable = false)
  private CareerSquad careerSquad;

  private String fullName;
  private LocalDate birthDate;

  private int startingOverall;
  private int currentOverall;
  private int potentialOverall;
  private long currentMarketValue;
  private long currentWage;

  @Enumerated(EnumType.STRING)
  private PreferredFoot preferredFoot;

  @Enumerated(EnumType.STRING)
  @Column(name = "player_role")
  private PlayerRole role;

  public String getDisplayName() {
    return (playerInfo != null) ? playerInfo.getFullName() : this.fullName;
  }

  public int getAgeInSeason(LocalDate seasonStartDate) {
    LocalDate dateToUse = (playerInfo != null) ? playerInfo.getDateOfBirth() : this.birthDate;
    return (dateToUse != null) ? Period.between(dateToUse, seasonStartDate).getYears() : 0;
  }

  public int getPotentialOverall() {
    if (this.playerInfo != null) {
      return this.playerInfo.getPotential();
    }
    return this.potentialOverall;
  }

  public Long getCountryId() {
    Long countryId = null;
    if (this.playerInfo != null && this.playerInfo.getCountry() != null) {
      countryId = this.playerInfo.getCountry().getId();
    } else if (this.country != null) {
      countryId = this.country.getId();
    }
    return countryId;
  }

  public PreferredFoot getPreferredFoot() {
    if (this.playerInfo != null) {
      return this.playerInfo.getPreferredFoot();
    }
    return this.preferredFoot;
  }

  public static SquadPlayer promoteFromYouth(YouthPlayer youth) {
    return SquadPlayer.builder()
        .playerInfo(null)
        .fullName(youth.getFullName())
        .birthDate(youth.getDateOfBirth())
        .country(youth.getCountry())
        .careerSquad(youth.getCareerSquad())
        .startingOverall(youth.getCurrentOverall())
        .currentOverall(youth.getCurrentOverall())
        .potentialOverall(youth.getPotentialOverall())
        .currentMarketValue(youth.getCurrentMarketValue())
        .currentWage(youth.getCurrentWage())
        .preferredFoot(youth.getPreferredFoot())
        .role(youth.getRole() != null ? youth.getRole() : PlayerRole.PROSPECT)
        .build();
  }
}
