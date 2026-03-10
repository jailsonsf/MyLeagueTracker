package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.YouthPlayer;

@Repository
public interface YouthPlayerRepository extends JpaRepository<YouthPlayer, Long> {
  List<YouthPlayer> findByCareerSquadId(Long careerSquadId);
}
