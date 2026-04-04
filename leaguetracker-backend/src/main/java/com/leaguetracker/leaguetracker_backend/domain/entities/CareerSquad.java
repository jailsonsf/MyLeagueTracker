package com.leaguetracker.leaguetracker_backend.domain.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_squad")
@Getter
@Setter
public class CareerSquad {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "career_id", nullable = false)
  private Career career;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "career_squad_id")
  private List<SquadPlayer> players;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "career_squad_id")
  private List<YouthPlayer> youthAcademy;
}
