package com.leaguetracker.leaguetracker_backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;

import com.leaguetracker.leaguetracker_backend.domain.Player;
import com.leaguetracker.leaguetracker_backend.dto.PlayerDTO;
import com.leaguetracker.leaguetracker_backend.dto.PlayerSearchDTO;
import com.leaguetracker.leaguetracker_backend.repository.PlayerRepository;

@Service
public class PlayerCatalogService {

  @Autowired
  private PlayerRepository playerRepository;

  public Page<PlayerDTO> search(PlayerSearchDTO filter, Pageable pageable) {
    Page<Player> players = playerRepository.findAll((root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (filter.fullName() != null) {
        predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + filter.fullName().toLowerCase() + "%"));
      }

      if (filter.overallMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("overall"), filter.overallMin()));
      }

      if (filter.overallMax() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("overall"), filter.overallMax()));
      }

      if (filter.potentialMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("potential"), filter.potentialMin()));
      }

      if (filter.potentialMax() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("potential"), filter.potentialMax()));
      }

      if (filter.position() != null) {
        predicates.add(cb.equal(root.get("positions"), filter.position()));
      }

      if (filter.valueMin() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("value"), filter.valueMin()));
      }

      if (filter.valueMax() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("value"), filter.valueMax()));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    }, pageable);

    return players.map(player -> new PlayerDTO(
        player.getId(),
        player.getExternalId(),
        player.getFullName(),
        player.getDateOfBirth(),
        player.getOverall(),
        player.getPotential(),
        player.getPositions(),
        player.getPreferredFoot(),
        player.getValue(),
        player.getWage(),
        player.getImage(),
        player.getHeightCm(),
        player.getWeightKg(),
        player.getKitNumber()));
  }

  public PlayerDTO getPlayerById(Long player_id) {
    return playerRepository.findById(player_id)
        .map(player -> new PlayerDTO(
            player.getId(),
            player.getExternalId(),
            player.getFullName(),
            player.getDateOfBirth(),
            player.getOverall(),
            player.getPotential(),
            player.getPositions(),
            player.getPreferredFoot(),
            player.getValue(),
            player.getWage(),
            player.getImage(),
            player.getHeightCm(),
            player.getWeightKg(),
            player.getKitNumber()))
        .orElse(null);
  }
}
