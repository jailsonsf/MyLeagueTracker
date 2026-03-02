package com.leaguetracker.leaguetracker_backend.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "careers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Career {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private GameTitle game;

  @Column(nullable = false)
  private String manager;

  @Column(nullable = false)
  private String teamName;

  private String teamLogo;

  private BigDecimal budget;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private LocalDate startDate;

  private LocalDate currentSeason;

  @OneToMany(mappedBy = "career", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CareerPlayer> squad;

  public void advanceSeason() {
    this.currentSeason = this.currentSeason.plusYears(1);
  }
}
