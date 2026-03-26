package com.leaguetracker.leaguetracker_backend.service;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import com.leaguetracker.leaguetracker_backend.domain.enums.Position;

@Converter
public class PositionAttributeConverter implements AttributeConverter<Set<Position>, String> {

  @Override
  public String convertToDatabaseColumn(Set<Position> attribute) {
    if (attribute == null || attribute.isEmpty())
      return "";
    return attribute.stream()
        .map(Enum::name)
        .collect(Collectors.joining(","));
  }

  @Override
  public Set<Position> convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isBlank())
      return Set.of();
    return Arrays.stream(dbData.split(","))
        .map(Position::valueOf)
        .collect(Collectors.toSet());
  }
}