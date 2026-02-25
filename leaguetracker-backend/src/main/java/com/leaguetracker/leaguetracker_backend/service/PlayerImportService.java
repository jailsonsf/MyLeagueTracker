package com.leaguetracker.leaguetracker_backend.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.Club;
import com.leaguetracker.leaguetracker_backend.domain.Player;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;
import com.leaguetracker.leaguetracker_backend.repository.PlayerRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

@Service
public class PlayerImportService {

  @Autowired
  private PlayerRepository playerRepository;
  @Autowired
  private ClubRepository clubRepository;

  public void importCsv(InputStream inputStream) {
    try (Reader reader = new BufferedReader(new InputStreamReader(inputStream))) {
      CsvToBean<Player> csvToBean = new CsvToBeanBuilder<Player>(reader)
          .withType(Player.class)
          .withIgnoreLeadingWhiteSpace(true)
          .withThrowExceptions(false)
          .build();

      List<Player> allPlayersFromCsv = csvToBean.parse();

      Map<Long, Club> clubMap = new HashMap<>();

      for (Player player : allPlayersFromCsv) {
        Long clubId = player.getCsvClubId();

        if (clubId != null && clubId != 0) {
          Club club = clubMap.computeIfAbsent(clubId, id -> {
            return clubRepository.findById(id).orElse(
                Club.builder()
                    .externalId(id)
                    .name(player.getCsvClubName())
                    .logoUrl(player.getCsvClubLogo())
                    .leagueId(player.getCsvLeagueId())
                    .leagueName(player.getCsvLeagueName())
                    .build());
          });

          player.setClub(club);
        }
      }

      playerRepository.saveAll(allPlayersFromCsv);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}