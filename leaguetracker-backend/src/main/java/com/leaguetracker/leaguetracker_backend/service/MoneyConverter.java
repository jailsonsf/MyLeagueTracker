package com.leaguetracker.leaguetracker_backend.service;

import com.opencsv.bean.AbstractBeanField;

public class MoneyConverter extends AbstractBeanField<Long, String> {

  @Override
  protected Object convert(String value) {
    if (value == null || value.isBlank() || value.equals("0")) {
      return 0L;
    }

    String cleanValue = value.replaceAll("€", "").replace("£", "").trim();

    try {
      if (cleanValue.endsWith("M")) {
        return (long) (Double.parseDouble(cleanValue.replace("M", "")) * 1_000_000);
      } else if (cleanValue.endsWith("K")) {
        return (long) (Double.parseDouble(cleanValue.replace("K", "")) * 1_000);
      } else {
        return Long.parseLong(cleanValue);
      }
    } catch (NumberFormatException e) {
      return 0L;
    }
  }
}
