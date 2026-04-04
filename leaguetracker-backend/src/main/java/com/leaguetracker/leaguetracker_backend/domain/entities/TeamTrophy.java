package com.leaguetracker.leaguetracker_backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("TEAM")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TeamTrophy extends Trophy {
  private Boolean isWinner;
  private String classification;
}
