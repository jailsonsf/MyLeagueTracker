package com.leaguetracker.leaguetracker_backend.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.CorsFilter;

class CorsPreflightTest {

  private static final String FRONTEND_ORIGIN = "http://localhost:5173";

  private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new CorsProbeController())
      .addFilter(new CorsFilter(new CorsConfig(FRONTEND_ORIGIN).corsConfigurationSource()))
      .build();

  @Test
  void browserPreflightForTheCareersEndpointSucceeds() throws Exception {
    mockMvc
        .perform(options("/api/careers")
            .header("Origin", FRONTEND_ORIGIN)
            .header("Access-Control-Request-Method", "GET")
            .header("Access-Control-Request-Headers", "authorization"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", FRONTEND_ORIGIN))
        .andExpect(header().string("Access-Control-Allow-Headers", "authorization"));
  }

  @Test
  void requestsFromUnknownOriginsAreNotGrantedAccess() throws Exception {
    mockMvc
        .perform(options("/api/careers")
            .header("Origin", "https://evil.example")
            .header("Access-Control-Request-Method", "GET"))
        .andExpect(status().isForbidden());
  }

  @RestController
  static class CorsProbeController {

    @GetMapping("/api/careers")
    String careers() {
      return "ok";
    }
  }
}
