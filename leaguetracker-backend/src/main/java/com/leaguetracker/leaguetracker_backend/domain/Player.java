package com.leaguetracker.leaguetracker_backend.domain;

import java.time.LocalDate;
import java.util.Set;

import com.leaguetracker.leaguetracker_backend.service.MoneyConverter;
import com.leaguetracker.leaguetracker_backend.service.PositionAttributeConverter;
import com.leaguetracker.leaguetracker_backend.service.PositionConverter;
import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import com.opencsv.bean.CsvDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "player_seq")
  @SequenceGenerator(name = "player_seq", sequenceName = "player_id_seq", allocationSize = 50)
  private Long id;

  @CsvBindByName(column = "player_id")
  private Long externalId;

  @CsvBindByName(column = "full_name")
  private String fullName;

  @CsvBindByName(column = "overall_rating")
  private int overall;

  @CsvBindByName(column = "potential")
  private int potential;

  @CsvCustomBindByName(column = "value", converter = MoneyConverter.class)
  private Long value;

  @CsvCustomBindByName(column = "wage", converter = MoneyConverter.class)
  private Long wage;

  @Enumerated(EnumType.STRING)
  @CsvBindByName(column = "preferred_foot")
  private PreferredFoot preferredFoot;

  @CsvBindByName(column = "dob")
  @CsvDate("yyyy-MM-dd")
  private LocalDate dateOfBirth;

  @CsvBindByName(column = "image")
  private String image;

  @CsvBindByName(column = "height_cm")
  private int heightCm;

  @CsvBindByName(column = "weight_kg")
  private int weightKg;

  @Column(name = "positions")
  @Convert(converter = PositionAttributeConverter.class)
  @CsvCustomBindByName(column = "positions", converter = PositionConverter.class)
  private Set<Position> positions;

  @ManyToOne
  @JoinColumn(name = "country_id")
  private Country country;

  @ManyToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(name = "club_id")
  private Club club;

  @CsvBindByName(column = "club_kit_number")
  private int kitNumber;

  @Transient
  @CsvBindByName(column = "club_id")
  private Long csvClubId;
  @Transient
  @CsvBindByName(column = "club_name")
  private String csvClubName;
  @Transient
  @CsvBindByName(column = "club_logo")
  private String csvClubLogo;
  @Transient
  @CsvBindByName(column = "club_rating")
  private Integer csvClubRating;
  @Transient
  @CsvBindByName(column = "country_name")
  private String csvCountryName;
}
