package com.leaguetracker.leaguetracker_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.leaguetracker.leaguetracker_backend.domain.League;
import com.leaguetracker.leaguetracker_backend.dto.LeagueResponseWrapper;
import com.leaguetracker.leaguetracker_backend.dto.LeagueDataDTO;
import com.leaguetracker.leaguetracker_backend.repository.LeagueRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LeagueImportService {

  @Autowired
  private LeagueRepository leagueRepository;

  private final RestTemplate restTemplate = new RestTemplate();

  @Value("${api.football.api-key}")
  private String apiKey;

  @Value("${api.football.base-url}")
  private String apiUrl;

  @Transactional
  public void fetchLeagues() {
    HttpHeaders headers = new HttpHeaders();
    headers.set("x-apisports-key", apiKey);
    HttpEntity<Void> entity = new HttpEntity<>(headers);

    try {
      ResponseEntity<LeagueResponseWrapper> responseEntity = restTemplate.exchange(
          apiUrl + "/leagues?season=2024",
          HttpMethod.GET,
          entity,
          LeagueResponseWrapper.class);

      LeagueResponseWrapper body = responseEntity.getBody();
      if (body == null || body.response() == null) {
        log.warn("API retornou corpo vazio.");
        return;
      }

      Map<Long, League> currentLeaguesMap = leagueRepository.findAll().stream()
          .filter(l -> l.getExternalId() != null)
          .collect(Collectors.toMap(League::getExternalId, l -> l, (a, b) -> a));

      List<League> toSave = new ArrayList<>();

      for (LeagueDataDTO data : body.response()) {
        var info = data.league();
        var country = data.country();
        Long extId = info.id();

        if (currentLeaguesMap.containsKey(extId)) {
          League existing = currentLeaguesMap.get(extId);
          existing.setName(info.name());
          existing.setType(info.type());
          existing.setLogo(info.logo());
          existing.setCountryName(country.name());
          existing.setCountryCode(country.code());
          existing.setCountryFlag(country.flag());
          toSave.add(existing);
        } else {
          toSave.add(League.builder()
              .externalId(extId)
              .name(info.name())
              .type(info.type())
              .logo(info.logo())
              .countryName(country.name())
              .countryCode(country.code())
              .countryFlag(country.flag())
              .build());
        }
      }

      leagueRepository.saveAll(toSave);
      log.info("Importação de {} ligas concluída.", toSave.size());

    } catch (Exception e) {
      log.error("Erro ao importar ligas: {}", e.getMessage());
      throw new RuntimeException("Falha na integração com API-Sports", e);
    }
  }
}