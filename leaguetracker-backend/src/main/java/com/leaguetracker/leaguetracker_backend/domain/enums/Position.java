package com.leaguetracker.leaguetracker_backend.domain.enums;

import lombok.Getter;

@Getter
public enum Position {
  GK("Goleiro"),
  CB("Zagueiro"),
  LB("Lateral Esquerdo"),
  RB("Lateral Direito"),
  CDM("Volante"),
  CM("Meia Central"),
  CAM("Meia Atacante"),
  LM("Meia Esquerda"),
  RM("Meia Direita"),
  ST("Atacante"),
  LW("Ponta Esquerda"),
  RW("Ponta Direita"),
  CF("Segundo Atacante");

  private final String positionName;

  Position(String positionName) {
    this.positionName = positionName;
  }
}
