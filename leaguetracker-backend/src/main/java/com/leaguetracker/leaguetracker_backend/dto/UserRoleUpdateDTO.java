package com.leaguetracker.leaguetracker_backend.dto;

import com.leaguetracker.leaguetracker_backend.domain.enums.UserRole;

public record UserRoleUpdateDTO(String username, UserRole newRole) {
}
