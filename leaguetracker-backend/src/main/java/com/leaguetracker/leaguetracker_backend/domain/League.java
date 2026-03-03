package com.leaguetracker.leaguetracker_backend.domain;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leagues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class League {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "league_seq")
  @SequenceGenerator(name = "league_seq", sequenceName = "league_id_seq", allocationSize = 50)
  private Long id;

  private Long externalId;
  private String name;

  @OneToMany(mappedBy = "league", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Club> clubs;
}
