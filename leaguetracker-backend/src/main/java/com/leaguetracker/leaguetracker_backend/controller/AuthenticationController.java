package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.User;
import com.leaguetracker.leaguetracker_backend.domain.UserRole;
import com.leaguetracker.leaguetracker_backend.dto.AuthenticationDTO;
import com.leaguetracker.leaguetracker_backend.dto.LoginResponseDTO;
import com.leaguetracker.leaguetracker_backend.dto.RegisterDTO;
import com.leaguetracker.leaguetracker_backend.dto.UserRoleUpdateDTO;
import com.leaguetracker.leaguetracker_backend.repository.UserRepository;
import com.leaguetracker.leaguetracker_backend.security.TokenService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private TokenService tokenService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
    var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());

    var auth = this.authenticationManager.authenticate(usernamePassword);

    var token = tokenService.generateToken((User) auth.getPrincipal());

    return ResponseEntity.ok(new LoginResponseDTO(token));
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody @Valid RegisterDTO data) {
    if (this.userRepository.findByUsername(data.username()).isPresent()
        || this.userRepository.findByEmail(data.email()).isPresent()) {
      return ResponseEntity.badRequest().body("Erro: Username ou email já estão em uso");
    }

    String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
    User user = new User(data.username(), data.email(), encryptedPassword, UserRole.USER);
    this.userRepository.save(user);

    return ResponseEntity.ok().body("Usuário registrado com sucesso!");
  }

  @PatchMapping("/admin/update-role")
  public ResponseEntity<Void> updateUserRole(@RequestBody @Valid UserRoleUpdateDTO data) {
    var user = (User) userRepository.findByUsername(data.username())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    user.setRole(data.newRole());
    userRepository.save(user);

    return ResponseEntity.ok().build();
  }
}
