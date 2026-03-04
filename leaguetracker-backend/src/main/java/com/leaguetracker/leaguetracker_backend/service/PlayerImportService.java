package com.leaguetracker.leaguetracker_backend.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.domain.Club;
import com.leaguetracker.leaguetracker_backend.domain.Player;
import com.leaguetracker.leaguetracker_backend.repository.ClubRepository;
import com.leaguetracker.leaguetracker_backend.repository.PlayerRepository;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

import jakarta.transaction.Transactional;

@Service
public class PlayerImportService {

  @Autowired
  private PlayerRepository playerRepository;

  @Autowired
  private ClubRepository clubRepository;

  @Transactional
  public void importCsv(InputStream inputStream) {
    try (Reader reader = new BufferedReader(new InputStreamReader(inputStream))) {
      CsvToBean<Player> csvToBean = new CsvToBeanBuilder<Player>(reader)
          .withType(Player.class)
          .withIgnoreLeadingWhiteSpace(true)
          .withThrowExceptions(false)
          .build();

      List<Player> allPlayersFromCsv = csvToBean.parse();

      List<Long> externalIdsInCsv = allPlayersFromCsv.stream()
          .map(Player::getExternalId)
          .filter(id -> id != null)
          .collect(Collectors.toList());

      Map<Long, Player> existingPlayersMap = playerRepository.findByExternalIdIn(externalIdsInCsv)
          .stream()
          .collect(Collectors.toMap(Player::getExternalId, p -> p));

      Map<Long, Club> clubMap = clubRepository.findAll().stream()
          .collect(Collectors.toMap(Club::getExternalId, c -> c, (a, b) -> a));

      for (Player player : allPlayersFromCsv) {
        Long player_id = player.getExternalId();
        if (player_id == null)
          continue;

        Long clubId = player.getCsvClubId();

        if (clubId != null && clubId != 0) {
          Club club = clubMap.computeIfAbsent(clubId, id -> {
            return clubRepository.save(
                Club.builder()
                    .externalId(id)
                    .name(player.getCsvClubName())
                    .clubRating(player.getCsvClubRating())
                    .build());
          });

          if (existingPlayersMap.containsKey(player_id)) {
            Player existing = existingPlayersMap.get(player_id);
            updateFields(existing, player, club);
          } else {
            player.setClub(club);
            existingPlayersMap.put(player_id, player);
          }
        }
      }

      playerRepository.saveAll(existingPlayersMap.values());

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void updateFields(Player existing, Player updated, Club club) {
    existing.setFullName(updated.getFullName());
    existing.setPositions(updated.getPositions());
    existing.setOverall(updated.getOverall());
    existing.setPotential(updated.getPotential());
    existing.setValue(updated.getValue());
    existing.setWage(updated.getWage());
    existing.setPreferredFoot(updated.getPreferredFoot());
    existing.setDateOfBirth(updated.getDateOfBirth());
    existing.setHeightCm(updated.getHeightCm());
    existing.setWeightKg(updated.getWeightKg());
    existing.setClub(club);
  }
}