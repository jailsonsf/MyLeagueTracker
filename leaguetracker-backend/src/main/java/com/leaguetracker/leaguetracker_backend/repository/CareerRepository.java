package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.entities.Career;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {
  List<Career> findByUser_Username(String username);
}
