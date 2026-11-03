# SPEC Toolbox Design System — PrimeOne

Angular workspace with two projects:

| Project | Path | What it is |
|---|---|---|
| `@spec/ui` | `projects/spec/ui` | The library developers install: PrimeNG preset, brand CSS, SPEC components. See its [README](projects/spec/ui/README.md). |
| `spec-ds` | `src/` | Storybook-style docs site. Imports `@spec/ui` straight from source, so changes show up live. |

Stack: Angular 21 · PrimeNG 21.1.10 (MIT) · Vitest · strict TypeScript and strict templates.

## Commands

```bash
npm install
npm start             # docs site on http://localhost:4200
npm run test:lib      # library unit tests (Vitest)
npm run build:lib     # library → dist/spec/ui
npm run pack:lib      # library → dist/spec-ui-<version>.tgz
npm run publish:lib   # publish to the registry configured in .npmrc
npm run build:docs    # docs → dist/spec-ds/browser (static, host anywhere)
```

`.npmrc` sets `legacy-peer-deps=true` to work around an npm 10 resolver bug with Vitest's optional peers.

## Layout

```
projects/spec/ui/src/
  public-api.ts            # everything exported from '@spec/ui'
  styles/spec-ui.css       # brand tokens (light + dark)
  lib/
    provide-spec-ui.ts     # provideSpecUI()
    preset/spec-preset.ts  # SpecPreset + BRAND_TOKENS (from Figma variables)
    calc-input/            # <spec-calc-input>   + spec
    check-summary/         # <spec-check-summary> + spec
    segmented-control/     # <spec-segmented>    + spec
    side-nav/              # <spec-side-nav>     + spec
    discussion-card/  app-header/  status-badge/  logo/

src/app/
  docs/                    # doc engine: ComponentDoc, canvas, controls, code generator
  pages/                   # one doc page per component
  registry.ts              # sidebar navigation
```

## Adding a SPEC component

1. Create `projects/spec/ui/src/lib/<name>/<name>.ts` (standalone, `OnPush`, signal inputs, `spec-` selector, light-mode CSS fallbacks).
2. Add a `<name>.spec.ts`, export it from `public-api.ts`, note it in `CHANGELOG.md`.
3. Document it: add a `ComponentDoc` + page in `src/app/pages/spec-docs.ts` (props, events, types, usage, accessibility, stories) and register it in `registry.ts`.

## Releasing

1. Bump `version` in `projects/spec/ui/package.json` and add a `CHANGELOG.md` entry.
2. `npm run test:lib && npm run publish:lib`.
3. Rebuild and redeploy the docs site.

The `@spec` scope must match your registry organisation; rename the package if it differs.
