package com.leaguetracker.leaguetracker_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

}
