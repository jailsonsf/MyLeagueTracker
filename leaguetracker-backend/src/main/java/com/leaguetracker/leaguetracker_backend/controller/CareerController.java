package com.leaguetracker.leaguetracker_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leaguetracker.leaguetracker_backend.domain.Career;
import com.leaguetracker.leaguetracker_backend.repository.CareerRepository;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/careers")
public class CareerController {

  private final CareerRepository repository;

  public CareerController(CareerRepository repository) {
    this.repository = repository;
  }

  @PostMapping
  public Career create(@RequestBody Career career) {
    return repository.save(career);
  }

  @GetMapping
  public List<Career> listAll() {
    return repository.findAll();
  }
}
