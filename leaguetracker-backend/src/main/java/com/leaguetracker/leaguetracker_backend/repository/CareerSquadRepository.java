package com.leaguetracker.leaguetracker_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.entities.CareerSquad;

@Repository
public interface CareerSquadRepository extends JpaRepository<CareerSquad, Long> {

}
