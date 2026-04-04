package com.leaguetracker.leaguetracker_backend.domain.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seasons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Season {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Integer startYear;
  private Integer endYear;

  @ManyToOne
  @JoinColumn(name = "career_id")
  private Career career;

  @OneToMany(mappedBy = "season", cascade = CascadeType.ALL)
  private List<Trophy> trophies;

  @OneToMany(mappedBy = "season")
  private List<Transfer> transfers;

  @Transient
  public String getSeasonName() {
    String startYearString = Integer.toString(this.startYear);
    String endYearString = Integer.toString(this.endYear);

    return startYearString + "/" + endYearString;
  }
}
