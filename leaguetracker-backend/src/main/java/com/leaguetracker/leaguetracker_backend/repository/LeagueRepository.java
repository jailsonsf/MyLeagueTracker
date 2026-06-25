package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.League;

public interface LeagueRepository extends JpaRepository<League, Long> {
  Optional<League> findByExternalId(Long id);

  List<League> findByCountryId(Long countryId);
}
