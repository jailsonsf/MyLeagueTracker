package com.leaguetracker.leaguetracker_backend.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "careers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Career {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GameTitle game;

  @Column(nullable = false)
  private String manager;

  @Column(nullable = false)
  private String teamName;

  private String teamLogo;

  private BigDecimal budget;

  private LocalDate startDate;

  private Long externalId;
}
