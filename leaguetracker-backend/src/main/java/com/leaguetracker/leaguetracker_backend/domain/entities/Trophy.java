package com.leaguetracker.leaguetracker_backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "trophy_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trophy {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private Season season;

  @ManyToOne
  @JoinColumn(name = "league_id")
  private League league;

  @ManyToOne
  @JoinColumn(name = "career_id")
  private Career career;
}
