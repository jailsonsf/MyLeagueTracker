package com.leaguetracker.leaguetracker_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.entities.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
  Optional<Club> findByExternalId(Long id);
}
