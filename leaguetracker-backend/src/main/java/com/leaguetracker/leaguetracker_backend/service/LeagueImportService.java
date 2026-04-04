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

import com.leaguetracker.leaguetracker_backend.dto.LeagueResponseWrapper;
import com.leaguetracker.leaguetracker_backend.domain.entities.Country;
import com.leaguetracker.leaguetracker_backend.domain.entities.League;
import com.leaguetracker.leaguetracker_backend.dto.LeagueDataDTO;
import com.leaguetracker.leaguetracker_backend.dto.LeagueInfoDTO;
import com.leaguetracker.leaguetracker_backend.repository.CountryRepository;
import com.leaguetracker.leaguetracker_backend.repository.LeagueRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LeagueImportService {

  @Autowired
  private LeagueRepository leagueRepository;

  @Autowired
  private CountryRepository countryRepository;

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

      Map<String, Country> countryMap = countryRepository.findAll().stream()
          .collect(Collectors.toMap(Country::getName, c -> c, (a, b) -> a));

      Map<Long, League> currentLeaguesMap = leagueRepository.findAll().stream()
          .filter(l -> l.getExternalId() != null)
          .collect(Collectors.toMap(League::getExternalId, l -> l, (a, b) -> a));

      List<League> toSave = new ArrayList<>();

      for (LeagueDataDTO data : body.response()) {
        var info = data.league();
        var countryData = data.country();
        Long extId = info.id();

        Country country = countryMap.computeIfAbsent(countryData.name(), name -> {
          log.debug("Novo país detectado: {}", name);
          return countryRepository.save(Country.builder()
              .name(name)
              .code(countryData.code())
              .flag(countryData.flag())
              .build());
        });

        if (currentLeaguesMap.containsKey(extId)) {
          League existing = currentLeaguesMap.get(extId);
          upadteLeagueFields(existing, info, country);
          toSave.add(existing);
        } else {
          toSave.add(League.builder()
              .externalId(extId)
              .name(info.name())
              .type(info.type())
              .logo(info.logo())
              .country(country)
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

  private void upadteLeagueFields(League league, LeagueInfoDTO info, Country country) {
    league.setName(info.name());
    league.setType(info.type());
    league.setLogo(info.logo());
    league.setCountry(country);
  }
}