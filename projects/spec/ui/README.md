# @spec/ui

SPEC Toolbox **PrimeOne** design system for Angular: the PrimeNG preset, brand tokens and SPEC product components, built from the Figma file *DS Spec Toolbox – PrimeOne*.

| | |
|---|---|
| Angular | 21 (standalone, signals, zoneless-ready) |
| PrimeNG | 21.1.x (MIT) |
| Docs | Storybook-style site in this repo (`npm start`) |

## Install

```bash
npm install @spec/ui primeng@21 @primeuix/themes@2 primeicons @angular/cdk@21
# before the package is published:
npm install ./spec-ui-0.1.0.tgz primeng@21 @primeuix/themes@2 primeicons @angular/cdk@21
```

## Setup

**1. Theme** — `app.config.ts`

```ts
import { provideSpecUI } from '@spec/ui';

export const appConfig: ApplicationConfig = {
  providers: [provideSpecUI()],
};
```

`provideSpecUI(options?)`

| Option | Default | |
|---|---|---|
| `darkModeSelector` | `'.app-dark'` | Selector that turns on dark mode. `'system'` follows the OS, `false` disables it. |
| `ripple` | `false` | PrimeNG ripple effect. |
| `cssLayer` | `false` | Put PrimeNG styles in a CSS layer (e.g. `'primeng'`) so app styles win without `!important`. |

Need full control? Use `providePrimeNG({ theme: { preset: SpecPreset } })` directly.

**2. Global styles** — `src/styles.scss`

```scss
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..700&display=swap');
@import 'primeicons/primeicons.css';
@import '@spec/ui/styles/spec-ui.css';

html { font-size: 14px; }          // PrimeOne base size (scale/1)
body { font-family: var(--spec-font); }
```

Or add `node_modules/@spec/ui/styles/spec-ui.css` to `styles` in `angular.json`.

Components carry light-mode fallbacks, so they render without the stylesheet; the stylesheet adds dark mode and a single place to override brand values.

## Components

All components are standalone. Import only what you use.

```ts
import { SpecCalcInput, SpecCheckSummary } from '@spec/ui';

@Component({ imports: [SpecCalcInput, SpecCheckSummary], ... })
```

### `<spec-calc-input>` — SpecCalcInput

Calculator parameter input with floating label, unit and info tooltip. Implements `ControlValueAccessor`; with a form control it shows the warning state automatically when the control is invalid and touched.

```html
<spec-calc-input label="Span length" unit="mm" formControlName="span"
  info="Clear span between supports." warning="Maximum span is 12 000 mm." />
```

| Input | Type | Default |
|---|---|---|
| `label` **required** | `string` | |
| `unit` | `string` | `''` |
| `value` (model) | `number \| string \| null` | `null` |
| `state` | `'default' \| 'readonly' \| 'disabled' \| 'warning'` | `'default'` |
| `info` | `string` | `''` |
| `warning` | `string` | `''` |
| `type` | `'number' \| 'text'` | `'number'` |
| `min`, `max`, `step` | `number` | — / — / `'any'` |
| `disabled` | `boolean` | `false` |
| `inputId`, `name` | `string` | auto / `''` |

Outputs: `valueChange`, `infoClick`, `blurred`.

### `<spec-check-summary>` — SpecCheckSummary

```html
<spec-check-summary title="Geometry Check" [status]="ratio > 100 ? 'fail' : 'pass'" [ratio]="ratio"
  message="Ratio exceeds 100%, auto-adjust parameters to resolve."
  [rows]="members" [(expanded)]="showValues" [fixing]="fixing()" (fix)="autoAdjust()" />
```

Inputs: `title` (required), `status: 'pass' | 'fail'`, `ratio: number | string | null` (numbers render as `%`), `message`, `fixable`, `fixCount`, `fixing`, `rows: SpecSummaryRow[]`, `expanded` (model), `passLabel`, `failLabel`, `fixLabel`. Outputs: `fix`, `expandedChange`.

### `<spec-segmented>` — SpecSegmentedControl

```html
<spec-segmented [options]="['Inputs', 'Outputs', 'Report']" [(value)]="view" ariaLabel="Calculator view" />
<spec-segmented [options]="units" [formControl]="unit" ariaLabel="Unit system" />
```

Inputs: `options` (required; strings or `SpecSegmentedOption<T>`), `value` (model), `size: 'medium' | 'small'`, `fluid`, `disabled`, `ariaLabel`. Output: `changed`. Implements `ControlValueAccessor`. Keyboard: arrows, Home, End.

### `<spec-discussion-card>` — SpecDiscussionCard

```html
<spec-discussion-card [title]="t.title" [date]="t.createdAt" status="resolved" thread="General Thread"
  [author]="t.lastAuthor" [excerpt]="t.lastMessage" [replies]="t.replyCount" [participants]="t.people"
  (opened)="open(t)" (menu)="menu.toggle($event)" />
```

Inputs: `title` (required), `date`, `dateFormat` (`'dd.MM.yy'`), `status: 'resolved' | 'open'`, `thread`, `author`, `excerpt`, `replies`, `participants: SpecParticipant[]`, `maxAvatars` (3), `compact`. Outputs: `opened`, `statusClick`, `menu(MouseEvent)`.

### `<spec-status-badge>` — SpecStatusBadge

```html
<spec-status-badge severity="error" value="Failed" dot />
```

Inputs: `value`, `severity: 'success' | 'error' | 'warning' | 'neutral'`, `dot`, `chevron`. Projects content when `value` is empty.

### `<spec-app-header>` — SpecAppHeader

```html
<spec-app-header [breadcrumb]="['My Project', 'Timber Office']" user="Adam Jones" [credits]="12"
  (upgrade)="goToBilling()" (settings)="openSettings()">
  <p-button specHeaderActions icon="pi pi-bell" [text]="true" severity="contrast" ariaLabel="Notifications" />
</spec-app-header>
```

Inputs: `breadcrumb: (string | SpecBreadcrumbItem)[]`, `user`, `credits: number | null`, `showUpgrade`, `upgradeLabel`, `showLogo`. Outputs: `breadcrumbClick`, `upgrade`, `creditsClick`, `settings`. Slot: `[specHeaderActions]`.

### `<spec-side-nav>` — SpecSideNav

```html
<spec-side-nav [workspace]="{ name: 'Personal Project', type: 'Personal', level: 'Pro' }"
  [sections]="nav" [footerSections]="account" [(activeId)]="current"
  (itemSelect)="router.navigate(['/', $event.id])" (workspaceClick)="wsMenu.toggle($event)" />
```

Inputs: `workspace: SpecWorkspace | null`, `sections: SpecNavSection[]`, `footerSections`, `activeId` (model), `showMenuButton`, `ariaLabel`. Outputs: `itemSelect`, `workspaceClick(MouseEvent)`, `menuToggle`. CSS: `--spec-side-nav-width`.

### `<spec-logo>` — SpecLogo

Inputs: `variant: 'color' | 'white'`, `height` (22), `alt`.

## Theming tokens

Override any of these after importing `spec-ui.css`:

| Variable | Light | Figma |
|---|---|---|
| `--spec-01` / `--spec-brand` | `#2bb673` | 01 |
| `--spec-02` / `--spec-ink-strong` | `#58595b` | 02 |
| `--spec-03` / `--spec-border` | `#edeef2` | 03 |
| `--spec-07` / `--spec-muted` | `#86888e` | 07 |
| `--spec-red` / `--spec-danger` | `#d9424d` | other/red |
| `--spec-font` | DM Sans stack | UI font |
| `--spec-radius` | `6px` | button/border/radius |

PrimeNG tokens are available as `--p-*` CSS variables (e.g. `--p-primary-color`).

## Accessibility

- Form components expose real `<label for>`, `aria-invalid`, `aria-describedby` and `role="alert"` warnings.
- Segmented control follows the WAI-ARIA radio group pattern with roving tabindex.
- Every icon-only button has an accessible name; decorative icons are `aria-hidden`.
- Motion respects `prefers-reduced-motion`.

## Development

```bash
npm start            # docs site, using the library source directly
npm run test:lib     # Vitest unit tests
npm run build:lib    # → dist/spec/ui
npm run pack:lib     # → dist/spec-ui-<version>.tgz
npm run publish:lib  # publish using .npmrc
```

Releasing: bump `version` in `projects/spec/ui/package.json`, add a `CHANGELOG.md` entry, then `npm run publish:lib`. The `@spec` scope must match your registry organisation; rename the package if it differs (for example `@spectoolbox/ui`).

## Known limitations

- The logo is a 1× PNG exported from Figma. Replace `src/lib/logo/logo-data.ts` with the SVG for sharp rendering on high-DPI screens.
- PrimeNG 22 needs a PrimeUI license key. This package targets PrimeNG 21.1.x, the last MIT release.
