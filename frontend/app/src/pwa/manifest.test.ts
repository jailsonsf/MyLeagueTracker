import { describe, expect, it } from 'vitest';

import { manifest } from './manifest';

describe('web app manifest', () => {
  it('declares an installable standalone app', () => {
    expect(manifest.name).toBe('MyLeagueTracker');
    expect(manifest.short_name).toBe('LeagueTracker');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.lang).toBe('pt-BR');
    expect(manifest.theme_color).toBe('#0e0e0e');
    expect(manifest.background_color).toBe('#0e0e0e');
  });

  it('provides the 192px, 512px and maskable icons', () => {
    const icons = manifest.icons ?? [];

    expect(icons.some((icon) => icon.sizes === '192x192')).toBe(true);
    expect(icons.some((icon) => icon.sizes === '512x512')).toBe(true);
    expect(icons.some((icon) => icon.purpose === 'maskable')).toBe(true);
  });
});
