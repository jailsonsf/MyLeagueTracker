package com.leaguetracker.leaguetracker_backend.domain;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "club_seq")
  @SequenceGenerator(name = "club_seq", sequenceName = "club_id_seq", allocationSize = 50)
  private Long id;
  private Long externalId;

  private String name;

  private int clubRating;

  @ManyToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(name = "league_id")
  private League league;

  @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Player> players;
}
