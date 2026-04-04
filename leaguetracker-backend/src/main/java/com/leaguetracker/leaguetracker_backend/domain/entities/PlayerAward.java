package com.leaguetracker.leaguetracker_backend.domain.entities;

import com.leaguetracker.leaguetracker_backend.domain.enums.IndividualAwardType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("PLAYER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerAward extends Trophy {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "player_id", nullable = true)
  private Player player;

  private String playerName;

  @Enumerated(EnumType.STRING)
  private IndividualAwardType awardType;

  private Integer goalsCount;
  private Integer assistsCount;
}
