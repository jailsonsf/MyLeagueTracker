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
  private String logo;

  private int clubRating;

  @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Player> players;
}
