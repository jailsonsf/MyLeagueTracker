package com.leaguetracker.leaguetracker_backend.controller;

import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.leaguetracker.leaguetracker_backend.service.PlayerImportService;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/import")
public class ImportDataController {

  @Autowired
  private PlayerImportService playerImportService;

  @PostMapping("/players")
  public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("Por favor, selecione um arquivo CSV para enviar.");
    }

    try {
      playerImportService.importCsv(file.getInputStream());
      return ResponseEntity.ok("Player data imported successfully: " + file.getOriginalFilename());
    } catch (Exception e) {
      return ResponseEntity.status(500).body("Error importing player data: " + e.getMessage());
    }
  }
}
