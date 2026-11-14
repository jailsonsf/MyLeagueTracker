package com.leaguetracker.leaguetracker_backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

  private final String allowedOrigins;

  public CorsConfig(@Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    Arrays.stream(allowedOrigins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isEmpty())
        .forEach(configuration::addAllowedOrigin);

    configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(false);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
