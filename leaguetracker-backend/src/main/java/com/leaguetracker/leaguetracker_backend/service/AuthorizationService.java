package com.leaguetracker.leaguetracker_backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.leaguetracker.leaguetracker_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthorizationService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
    return userRepository.findByUsername(login)
        .or(() -> userRepository.findByEmail(login))
        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + login));
  }
}
