package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;

public interface SquadPlayerRepository extends JpaRepository<SquadPlayer, Long> {
  List<SquadPlayer> findByCareerSquadId(Long careerSquadId);

  Optional<SquadPlayer> findByCareerSquadIdAndPlayerInfoId(Long careerSquadId, Long playerInfoId);
}
