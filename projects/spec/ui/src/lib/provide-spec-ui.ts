import { EnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { SpecPreset } from './preset/spec-preset';

export interface SpecUIOptions {
  /**
   * CSS selector that switches PrimeNG and SPEC components to dark mode.
   * Use `'system'` to follow the OS, or `false` to disable dark mode.
   * @default '.app-dark'
   */
  darkModeSelector?: string | false;
  /** Enable PrimeNG ripple effect. @default false */
  ripple?: boolean;
  /** Wrap PrimeNG styles in a CSS layer, e.g. `'primeng'`, so app styles win without `!important`. @default false */
  cssLayer?: string | false;
}

/**
 * Registers PrimeNG with the SPEC Toolbox PrimeOne preset.
 *
 * ```ts
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideSpecUI()],
 * };
 * ```
 */
export function provideSpecUI(options: SpecUIOptions = {}): EnvironmentProviders {
  const { darkModeSelector = '.app-dark', ripple = false, cssLayer = false } = options;
  return providePrimeNG({
    theme: {
      preset: SpecPreset,
      options: {
        darkModeSelector,
        cssLayer: cssLayer ? { name: cssLayer, order: `${cssLayer}, app` } : false,
      },
    },
    ripple,
  });
}
