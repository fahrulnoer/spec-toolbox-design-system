import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * SPEC Toolbox — PrimeOne preset.
 * Values come from the Figma file "DS Spec Toolbox - PrimeOne" (🌈 Colors page variables).
 * Base: PrimeNG Aura. Overrides: primary (SPEC green), surface (slate), focus ring, form field.
 */
export const SpecPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eaf8f1',
      100: '#d5f0e3',
      200: '#aae2c7',
      300: '#80d3ab',
      400: '#55c58f',
      500: '#2bb673',
      600: '#22925c',
      700: '#1a6d45',
      800: '#11492e',
      900: '#092417',
      950: '#04120b',
    },
    focusRing: { width: '1px', style: 'solid', color: '{primary.color}', offset: '2px' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
          500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
        formField: {
          background: '#ffffff',
          disabledBackground: '{surface.200}',
          filledBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{surface.700}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
          500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

/** SPEC brand tokens (Figma variables 01–07 + other/red). */
export const BRAND_TOKENS = [
  { token: '01', name: 'Brand Green', value: '#2bb673', use: 'Logo, primary actions, header bar' },
  { token: '02', name: 'Graphite', value: '#58595b', use: 'Headings in cards & summaries' },
  { token: '03', name: 'Mist', value: '#edeef2', use: 'Dividers and card borders' },
  { token: '04', name: 'White', value: '#ffffff', use: 'Card & content background' },
  { token: '07', name: 'Steel', value: '#86888e', use: 'Secondary labels, list keys' },
  { token: 'other/red', name: 'Alert Red', value: '#d9424d', use: 'FAIL states, error text' },
];
