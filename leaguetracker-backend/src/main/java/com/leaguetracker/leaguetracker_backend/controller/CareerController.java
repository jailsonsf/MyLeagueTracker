package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.dto.CareerDTO;
import com.leaguetracker.leaguetracker_backend.dto.CareerDetailsDTO;
import com.leaguetracker.leaguetracker_backend.service.CareerService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/careers")
public class CareerController {

  @Autowired
  private CareerService careerService;

  @PostMapping
  public ResponseEntity<CareerDetailsDTO> create(@RequestBody CareerDTO data, Authentication authentication) {
    CareerDetailsDTO createdCareer = careerService.create(data, authentication.getName());

    return ResponseEntity.status(HttpStatus.CREATED).body(createdCareer);
  }

  @GetMapping
  public List<CareerDetailsDTO> listAll(Authentication authentication) {
    return careerService.getCareersForUser(authentication.getName());
  }
}
