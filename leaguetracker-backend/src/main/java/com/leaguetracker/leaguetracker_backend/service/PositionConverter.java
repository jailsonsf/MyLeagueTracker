package com.leaguetracker.leaguetracker_backend.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.leaguetracker.leaguetracker_backend.domain.enums.Position;
import com.opencsv.bean.AbstractBeanField;
import com.opencsv.exceptions.CsvConstraintViolationException;
import com.opencsv.exceptions.CsvDataTypeMismatchException;

public class PositionConverter extends AbstractBeanField<Set<Position>, String> {

  @Override
  protected Set<Position> convert(String value) throws CsvDataTypeMismatchException, CsvConstraintViolationException {
    if (value == null || value.trim().isEmpty()) {
      return Set.of();
    }
    String[] positionsStrings = value.split(",");

    try {
      return Arrays.stream(positionsStrings)
          .map(String::trim)
          .filter(s -> !s.isEmpty())
          .map(Position::valueOf)
          .collect(Collectors.toSet());
    } catch (IllegalArgumentException e) {
      return new HashSet<Position>();
    }
  }
}
