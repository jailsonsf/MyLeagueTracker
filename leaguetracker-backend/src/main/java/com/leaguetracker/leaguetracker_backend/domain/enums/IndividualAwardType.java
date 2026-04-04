package com.leaguetracker.leaguetracker_backend.domain.enums;

import lombok.Getter;

@Getter
public enum IndividualAwardType {
  BALLON_D_OR("Bola de Ouro"),
  YASHIN_TROPHY("Troféu Yashin"),
  GOLDEN_BOY("Golden Boy"),
  BEST_PLAYER_COMPETITION("Melhor jogador da Competição"),
  TOP_SCORER("Mais gols"),
  TOP_ASSISTS("Mais Assistências"),
  PLAYER_OF_SEASON("Jogador da Temporada"),
  PLAYER_OF_MONTH("Jogador do Mês");

  private final String awardType;

  IndividualAwardType(String awardType) {
    this.awardType = awardType;
  }
}
