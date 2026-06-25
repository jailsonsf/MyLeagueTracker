package com.leaguetracker.leaguetracker_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.Club;

public interface ClubRepository extends JpaRepository<Club, Long> {
  Optional<Club> findByExternalId(Long id);
}
