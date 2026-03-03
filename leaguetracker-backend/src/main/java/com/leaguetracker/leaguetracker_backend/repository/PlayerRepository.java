package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
  List<Player> findByExternalIdIn(List<Long> externalIds);
}
