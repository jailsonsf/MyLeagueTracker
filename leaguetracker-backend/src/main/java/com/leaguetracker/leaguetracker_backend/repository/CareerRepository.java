package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.Career;

public interface CareerRepository extends JpaRepository<Career, Long> {
  List<Career> findByUser_Username(String username);
}
