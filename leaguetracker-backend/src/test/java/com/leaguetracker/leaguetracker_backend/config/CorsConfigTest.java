package com.leaguetracker.leaguetracker_backend.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;

class CorsConfigTest {

  private CorsConfiguration configuration() {
    return new CorsConfig("http://localhost:5173")
        .corsConfigurationSource()
        .getCorsConfiguration(new MockHttpServletRequest("OPTIONS", "/api/careers"));
  }

  @Test
  void allowsTheFrontendOrigin() {
    assertThat(configuration().checkOrigin("http://localhost:5173"))
        .isEqualTo("http://localhost:5173");
  }

  @Test
  void refusesUnknownOrigins() {
    assertThat(configuration().checkOrigin("https://evil.example")).isNull();
  }

  @Test
  void allowsTheMethodsAndHeadersTheAppUses() {
    CorsConfiguration configuration = configuration();

    assertThat(configuration.checkHttpMethod(HttpMethod.GET)).contains(HttpMethod.GET);
    assertThat(configuration.checkHttpMethod(HttpMethod.POST)).contains(HttpMethod.POST);
    assertThat(configuration.checkHttpMethod(HttpMethod.DELETE)).contains(HttpMethod.DELETE);
    assertThat(configuration.checkHttpMethod(HttpMethod.PUT)).isNull();
    assertThat(configuration.checkHeaders(List.of("authorization", "content-type")))
        .containsExactly("authorization", "content-type");
  }
}
