package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leaguetracker.leaguetracker_backend.domain.entities.Season;

public interface SeasonRepository extends JpaRepository<Season, Long> {
  List<Season> findByCareerId(Long careerId);
}
