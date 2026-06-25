package com.leaguetracker.leaguetracker_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.leaguetracker.leaguetracker_backend.domain.entities.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {

}
