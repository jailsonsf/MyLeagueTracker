package com.leaguetracker.leaguetracker_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.leaguetracker.leaguetracker_backend.domain.entities.PlayerAward;
import com.leaguetracker.leaguetracker_backend.domain.entities.TeamTrophy;
import com.leaguetracker.leaguetracker_backend.domain.entities.Trophy;
import com.leaguetracker.leaguetracker_backend.domain.enums.IndividualAwardType;

public interface TrophyRepository extends JpaRepository<Trophy, Long> {

  List<Trophy> findByCareerId(Long careerId);

  List<Trophy> findBySeasonId(Long seasonId);

  List<Trophy> findByLeagueId(Long leagueId);

  @Query("""
      select pa
      from PlayerAward pa
      where pa.career.id = :careerId
      """)
  List<PlayerAward> findPlayerAwardsByCareerId(Long careerId);

  @Query("""
      select pa
      from PlayerAward pa
      where pa.career.id = :careerId
        and pa.awardType = :awardType
      """)
  List<PlayerAward> findPlayerAwardsByCareerIdAndAwardType(
      Long careerId,
      IndividualAwardType awardType);

  @Query("""
      select tt
      from TeamTrophy tt
      where tt.career.id = :careerId
      """)
  List<TeamTrophy> findTeamTrophiesByCareerId(Long careerId);

  @Query("""
      select tt
      from TeamTrophy tt
      where tt.season.id = :seasonId
      """)
  List<TeamTrophy> findTeamTrophiesBySeasonId(Long seasonId);
}
