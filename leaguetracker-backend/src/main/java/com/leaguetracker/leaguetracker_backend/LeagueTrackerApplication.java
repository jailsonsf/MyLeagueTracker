package com.leaguetracker.leaguetracker_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class LeagueTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(LeagueTrackerApplication.class, args);
	}

}
