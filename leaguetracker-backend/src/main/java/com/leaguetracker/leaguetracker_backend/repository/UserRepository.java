package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leaguetracker.leaguetracker_backend.domain.User;
import com.leaguetracker.leaguetracker_backend.domain.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(String username);

  Optional<User> findByEmail(String email);

  List<User> findByRole(UserRole role);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);
}
