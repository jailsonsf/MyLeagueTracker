package com.leaguetracker.leaguetracker_backend.security;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.leaguetracker.leaguetracker_backend.domain.entities.User;

@Service
public class TokenService {

  @Value("${api.security.token.secret}")
  private String secret;

  public String generateToken(User user) {
    Algorithm algorithm = Algorithm.HMAC256(secret);
    return JWT.create()
        .withIssuer("league-tracker")
        .withSubject(user.getUsername())
        .withExpiresAt(Instant.now().plusSeconds(
            7200))
        .sign(algorithm);
  }

  public String validateToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);
      return JWT.require(algorithm)
          .withIssuer("league-tracker")
          .build()
          .verify(token)
          .getSubject();
    } catch (JWTVerificationException e) {
      return e.getMessage();
    }
  }
}
