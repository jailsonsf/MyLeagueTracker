package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.UserRole;

public record RegisterDTO(String username, String password, UserRole role) {
}
