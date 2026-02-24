package com.leaguetracker.leaguetracker_backend.repository;

import com.leaguetracker.leaguetracker_backend.domain.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {

}
