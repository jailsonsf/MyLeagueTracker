package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.entities.SquadPlayer;

@Repository
public interface SquadPlayerRepository extends JpaRepository<SquadPlayer, Long> {
  List<SquadPlayer> findByCareerSquadId(Long careerSquadId);
}
