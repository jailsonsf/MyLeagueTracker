package com.leaguetracker.leaguetracker_backend.domain.entities;

import com.leaguetracker.leaguetracker_backend.domain.enums.MarketScope;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferDirection;
import com.leaguetracker.leaguetracker_backend.domain.enums.TransferMethod;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transfers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transfer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "career_id")
  private Career career;

  @ManyToOne
  @JoinColumn(name = "season_id")
  private Season season;

  @Enumerated(EnumType.STRING)
  private MarketScope scope;

  @Enumerated(EnumType.STRING)
  private TransferDirection direction;

  @Enumerated(EnumType.STRING)
  private TransferMethod method;

  @ManyToOne
  @JoinColumn(name = "squad_player_id")
  private SquadPlayer squadPlayer;

  @ManyToOne
  @JoinColumn(name = "player_swap_id")
  private SquadPlayer playerSwap;

  @ManyToOne
  @JoinColumn(name = "origin_club_id")
  private Club originClub;

  @ManyToOne
  @JoinColumn(name = "destination_club_id")
  private Club destinationClub;

  private Double fee;
  private Double marketValue;
}
