package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.League;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
  Optional<League> findByExternalId(Long id);

  List<League> findByCountryId(Long countryId);
}
