package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.YouthPlayer;

public interface YouthPlayerRepository extends JpaRepository<YouthPlayer, Long> {
  List<YouthPlayer> findByCareerSquadId(Long careerSquadId);
}
