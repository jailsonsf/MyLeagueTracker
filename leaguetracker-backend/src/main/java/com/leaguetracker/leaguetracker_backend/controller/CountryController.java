package com.leaguetracker.leaguetracker_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.Country;
import com.leaguetracker.leaguetracker_backend.dto.CountryDTO;
import com.leaguetracker.leaguetracker_backend.repository.CountryRepository;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

  @Autowired
  private CountryRepository countryRepository;

  @GetMapping
  public ResponseEntity<List<CountryDTO>> getAllCountries() {
    List<CountryDTO> countries = countryRepository.findAll().stream()
        .map(this::convertCountryDTO)
        .collect(Collectors.toList());

    return ResponseEntity.ok(countries);
  }

  @GetMapping("/{id}")
  public ResponseEntity<CountryDTO> getCountry(@PathVariable Long id) {
    Country country = countryRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("País não encontrado"));

    return ResponseEntity.ok(convertCountryDTO(country));
  }

  private CountryDTO convertCountryDTO(Country country) {
    return new CountryDTO(
        country.getId(),
        country.getName(),
        country.getCode(),
        country.getFlag());
  }
}
