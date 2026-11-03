import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CodeBlock } from '../docs/code-block';
import { BRAND_TOKENS, SpecCalcInput, SpecCheckSummary, SpecSegmentedControl } from '@spec/ui';
import { PALETTES, PRIME_ICONS, TOKENS } from '../ds/figma-tokens';
import { NavService } from '../nav.service';

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function copyText(text: string, ms: MessageService) {
  const ok = () => ms.add({ severity: 'contrast', summary: 'Copied', detail: text, life: 1600 });
  try { navigator.clipboard.writeText(text).then(ok, () => {}); } catch { /* clipboard blocked */ }
}

function onDark(hex: string) {
  const n = parseInt(hex.slice(1, 7), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
}

/* ───────── Introduction ───────── */
@Component({
  selector: 'pg-intro',
  imports: [SpecCheckSummary, SpecCalcInput, SpecSegmentedControl, Button],
  template: `
    <article class="doc">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">DS Spec Toolbox · PrimeOne</div>
          <h1 class="hero-title">The design system behind SPEC Toolbox</h1>
          <p class="lede">Angular components on PrimeNG, themed with the PrimeOne tokens from Figma. Every page has a live preview, editable props and copy-ready code.</p>
          <div class="row-gap">
            <p-button label="Get started" icon="pi pi-arrow-right" iconPos="right" (onClick)="nav.go('installation')" />
            <p-button label="Browse components" severity="secondary" variant="outlined" (onClick)="nav.go('button')" />
          </div>
        </div>
        <div class="hero-demo" aria-label="Example SPEC components">
          <spec-segmented [options]="['Inputs', 'Outputs', 'Report']" value="Inputs" />
          <spec-calc-input label="Span length" unit="mm" [value]="4800" info="Clear span between supports." />
          <spec-calc-input label="Member depth" unit="mm" [value]="640" state="warning" warning="Depth must be between 90 and 600 mm." />
          <spec-check-summary title="Geometry Check" status="fail" [ratio]="140.3" message="Ratio exceeds 100%, auto-adjust parameters to resolve." [rows]="rows" />
        </div>
      </section>

      <section class="stat-row">
        @for (s of stats; track s.label) {
          <div class="stat"><div class="stat-num">{{ s.value }}</div><div class="stat-label">{{ s.label }}</div></div>
        }
      </section>

      <section class="grid-3">
        @for (c of cards; track c.title) {
          <button type="button" class="tile" (click)="nav.go(c.go)">
            <i class="pi" [class]="'pi ' + c.icon"></i>
            <h3>{{ c.title }}</h3>
            <p>{{ c.text }}</p>
          </button>
        }
      </section>

      <section class="prose">
        <h2>How this site is organised</h2>
        <p><strong>Foundations</strong> lists the colour, type and token values pulled from the Figma file. <strong>SPEC Components</strong> are product-specific pieces from the “❖ Custom Components” page. The remaining groups document PrimeNG components as they look with the PrimeOne preset.</p>
        <p>Each component page follows the same shape: a live canvas, a props table whose controls update the canvas, and stories for the main variants. “Show code” gives you the Angular template for what you see.</p>
      </section>
    </article>
  `,
})
export class IntroPage {
  nav = inject(NavService);
  rows = [{ label: 'Timber Member', value: 65.6 }, { label: 'Steel Plate', value: 0.65 }];
  stats = [
    { value: '22', label: 'colour palettes' },
    { value: TOKENS.length.toLocaleString('en'), label: 'design tokens' },
    { value: '35', label: 'documented components' },
    { value: String(PRIME_ICONS.length), label: 'icons' },
  ];
  cards = [
    { title: 'Colours', text: 'SPEC green primary scale, slate surfaces and brand tokens.', icon: 'pi-palette', go: 'colors' },
    { title: 'SPEC Components', text: 'Calculator input, check summary, discussion card and more.', icon: 'pi-calculator', go: 'calculator-input' },
    { title: 'Design tokens', text: 'Search every semantic and component token from Figma.', icon: 'pi-database', go: 'tokens' },
  ];
}

/* ───────── Installation ───────── */
@Component({
  selector: 'pg-install',
  imports: [CodeBlock],
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">Getting started</div>
        <h1>Installation</h1>
        <p class="lede">Everything ships in one package, <code>@spec/ui</code>: the PrimeOne preset for PrimeNG, the brand stylesheet and the SPEC components. Requires Angular 21 and PrimeNG 21.</p>
      </header>
      <section class="steps">
        <div class="step"><div class="step-n">1</div><div class="step-body"><h2>Install</h2>
          <p>Install from your registry, or from the tarball while the package is not published yet.</p>
          <ds-code lang="bash" label="Terminal" [code]="install" />
          <ds-code lang="bash" label=".npmrc (GitHub Packages example)" [code]="npmrc" /></div></div>
        <div class="step"><div class="step-n">2</div><div class="step-body"><h2>Register the theme</h2>
          <p><code>provideSpecUI()</code> wraps <code>providePrimeNG</code> with the SPEC preset. Every PrimeNG component then picks up the PrimeOne colours.</p>
          <ds-code lang="ts" label="app.config.ts" [code]="config" /></div></div>
        <div class="step"><div class="step-n">3</div><div class="step-body"><h2>Add global styles</h2>
          <p>The brand stylesheet adds dark-mode values and lets you override brand tokens in one place. PrimeOne is drawn at a 14px base in DM Sans.</p>
          <ds-code lang="scss" label="src/styles.scss" [code]="styles" /></div></div>
        <div class="step"><div class="step-n">4</div><div class="step-body"><h2>Use components</h2>
          <p>All components are standalone. Import what you use; everything else is tree-shaken.</p>
          <ds-code lang="ts" label="beam.component.ts" [code]="component" />
          <ds-code lang="html" label="beam.component.html" [code]="usage" /></div></div>
        <div class="step"><div class="step-n">5</div><div class="step-body"><h2>Dark mode</h2>
          <p>Toggle the class you passed as <code>darkModeSelector</code> (default <code>.app-dark</code>) on <code>&lt;html&gt;</code>. PrimeNG and SPEC components switch together.</p>
          <ds-code lang="ts" label="theme.service.ts" [code]="dark" /></div></div>
      </section>

      <h2 class="sec-title">What is in the package</h2>
      <div class="table-wrap">
        <table class="args">
          <thead><tr><th>Export</th><th>What it is</th></tr></thead>
          <tbody>
            @for (r of exportsList; track r[0]) { <tr><td class="arg-name"><code class="type">{{ r[0] }}</code></td><td class="arg-desc">{{ r[1] }}</td></tr> }
          </tbody>
        </table>
      </div>

      <h2 class="sec-title">Working on the library</h2>
      <ds-code lang="bash" label="Contributor commands" [code]="contrib" />
    </article>
  `,
})
export class InstallPage {
  install = `# from the registry\nnpm install @spec/ui primeng@21 @primeuix/themes@2 primeicons @angular/cdk@21\n\n# or from the release tarball\nnpm install ./spec-ui-0.1.0.tgz primeng@21 @primeuix/themes@2 primeicons @angular/cdk@21`;
  npmrc = `@spec:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}`;
  config = `import { ApplicationConfig } from '@angular/core';\nimport { provideSpecUI } from '@spec/ui';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideSpecUI(),                 // defaults: darkModeSelector '.app-dark', ripple off\n    // provideSpecUI({ darkModeSelector: 'system', cssLayer: 'primeng' }),\n  ],\n};`;
  styles = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..700&display=swap');\n@import 'primeicons/primeicons.css';\n@import '@spec/ui/styles/spec-ui.css';\n\nhtml { font-size: 14px; }\nbody { font-family: var(--spec-font); }`;
  component = `import { Component, signal } from '@angular/core';\nimport { Button } from 'primeng/button';\nimport { SpecCalcInput, SpecCheckSummary } from '@spec/ui';\n\n@Component({\n  selector: 'app-beam',\n  imports: [Button, SpecCalcInput, SpecCheckSummary],\n  templateUrl: './beam.component.html',\n})\nexport class BeamComponent {\n  span = signal<number | null>(4800);\n}`;
  usage = `<spec-calc-input label="Span length" unit="mm" [(value)]="span" info="Clear span between supports." />\n<p-button label="Calculate" icon="pi pi-calculator" (onClick)="run()" />\n<spec-check-summary title="Geometry Check" status="pass" [ratio]="65.6" />`;
  dark = `toggleDark(on: boolean) {\n  document.documentElement.classList.toggle('app-dark', on);\n}`;
  contrib = `npm start                 # docs site with live library source\nnpm run build:lib         # ng-packagr → dist/spec/ui\nnpm run test:lib          # Vitest unit tests for @spec/ui\nnpm run pack:lib          # dist/spec-ui-<version>.tgz\nnpm run publish:lib       # publish to the registry in .npmrc`;
  exportsList = [
    ['provideSpecUI(options?)', 'Registers PrimeNG with the SPEC preset. Options: darkModeSelector, ripple, cssLayer.'],
    ['SpecPreset', 'The raw PrimeNG preset (Aura + SPEC green primary, slate surface) if you call providePrimeNG yourself.'],
    ['BRAND_TOKENS', 'Brand colour list (01, 02, 03, 04, 07, other/red) with names and usage.'],
    ['@spec/ui/styles/spec-ui.css', 'Brand CSS variables (--spec-*) for light and dark mode.'],
    ['SpecCalcInput', '<spec-calc-input> · forms-ready calculator parameter input.'],
    ['SpecCheckSummary', '<spec-check-summary> · PASS / FAIL design check card.'],
    ['SpecSegmentedControl', '<spec-segmented> · forms-ready view switcher.'],
    ['SpecDiscussionCard', '<spec-discussion-card> · thread summary.'],
    ['SpecStatusBadge', '<spec-status-badge> · outlined status pill.'],
    ['SpecAppHeader', '<spec-app-header> · app top bar.'],
    ['SpecSideNav', '<spec-side-nav> · data-driven app navigation.'],
    ['SpecLogo', '<spec-logo> · SPEC Toolbox wordmark.'],
  ];
}

/* ───────── Colors ───────── */
@Component({
  selector: 'pg-colors',
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">Foundations</div>
        <h1>Colours</h1>
        <p class="lede">Values come from the variables on the “🌈 Colors” page of the Figma file. Click any swatch to copy its hex value.</p>
      </header>

      <h2 class="sec-title">Brand</h2>
      <div class="brand-grid">
        @for (b of brand; track b.token) {
          <button type="button" class="brand-sw" (click)="copy(b.value)">
            <span class="brand-chip" [style.background]="b.value"></span>
            <span class="brand-meta"><strong>{{ b.name }}</strong><code>{{ b.token }} · {{ b.value }}</code><small>{{ b.use }}</small></span>
          </button>
        }
      </div>

      <h2 class="sec-title">Primary <span class="muted">primary/50 – 950</span></h2>
      <div class="ramp big">
        @for (s of shades; track s) {
          <button type="button" class="ramp-sw" [style.background]="primary[s]" [style.color]="dark(primary[s]) ? '#fff' : '#0f172a'" (click)="copy(primary[s])" [attr.aria-label]="'primary ' + s + ' ' + primary[s]">
            <span>{{ s }}</span><code>{{ primary[s] }}</code>@if (s === '500') {<em>base</em>}
          </button>
        }
      </div>

      <h2 class="sec-title">Surface <span class="muted">surface/0 – 950 · slate</span></h2>
      <div class="ramp">
        @for (s of surfaceShades; track s) {
          <button type="button" class="ramp-sw" [style.background]="surface[s]" [style.color]="dark(surface[s]) ? '#fff' : '#0f172a'" (click)="copy(surface[s])" [attr.aria-label]="'surface ' + s">
            <span>{{ s }}</span><code>{{ surface[s] }}</code>
          </button>
        }
      </div>

      <h2 class="sec-title">Palettes <span class="muted">{{ palettes.length }} scales</span></h2>
      <div class="pal-list">
        @for (p of palettes; track p.name) {
          <div class="pal-row">
            <div class="pal-name">{{ p.name }}</div>
            <div class="pal-ramp">
              @for (s of shades; track s) {
                <button type="button" class="pal-sw" [style.background]="p.values[s]" (click)="copy(p.values[s])" [attr.aria-label]="p.name + ' ' + s + ' ' + p.values[s]" [attr.title]="p.name + '/' + s + ' · ' + p.values[s]"></button>
              }
            </div>
          </div>
        }
        <div class="pal-row pal-scale"><div class="pal-name"></div><div class="pal-ramp">@for (s of shades; track s) {<span>{{ s }}</span>}</div></div>
      </div>
    </article>
  `,
})
export class ColorsPage {
  private ms = inject(MessageService);
  brand = BRAND_TOKENS;
  shades = SHADES;
  surfaceShades = ['0', ...SHADES];
  primary: Record<string, string> = Object.fromEntries(TOKENS.filter(([k]) => /^primary\/\d+$/.test(k)).map(([k, v]) => [k.split('/')[1], v]));
  surface: Record<string, string> = Object.fromEntries(TOKENS.filter(([k]) => /^surface\/\d+$/.test(k)).map(([k, v]) => [k.split('/')[1], v]));
  palettes = Object.entries(PALETTES).map(([name, values]) => ({ name, values }));
  dark = onDark;
  copy(v: string) { copyText(v, this.ms); }
}

/* ───────── Typography ───────── */
@Component({
  selector: 'pg-typography',
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">Foundations</div>
        <h1>Typography</h1>
        <p class="lede">DM Sans throughout, on a 14px base (<code>scale/1</code>). Weights in use: Light 300 for list keys, Regular 400 for body, Medium 500 for labels and buttons, SemiBold 600 for titles and results.</p>
      </header>
      <div class="specimen">
        <div class="spec-big">Aa</div>
        <div class="spec-meta">
          <strong>DM Sans</strong>
          <span>Google Fonts · variable, optical size 9–40</span>
          <div class="weights">@for (w of weights; track w.w) {<span [style.font-weight]="w.w">{{ w.name }} {{ w.w }}</span>}</div>
          <p class="glyphs">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 · kN kPa mm² ≤ ≥ ± °</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="type-scale">
          <thead><tr><th>Role</th><th>Sample</th><th>Size / line</th><th>Weight</th><th>Token</th></tr></thead>
          <tbody>
            @for (t of scale; track t.role) {
              <tr>
                <td class="arg-name">{{ t.role }}</td>
                <td><span [style.font-size.px]="t.size" [style.line-height.px]="t.lh" [style.font-weight]="t.weight" [style.letter-spacing]="t.ls || null" [style.text-transform]="t.upper ? 'uppercase' : null">{{ t.sample }}</span></td>
                <td class="num">{{ t.size }} / {{ t.lh }}</td>
                <td class="num">{{ t.weight }}</td>
                <td>@if (t.token) {<code class="type">{{ t.token }}</code>} @else {<span class="muted">–</span>}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </article>
  `,
})
export class TypographyPage {
  weights = [{ name: 'Light', w: 300 }, { name: 'Regular', w: 400 }, { name: 'Medium', w: 500 }, { name: 'SemiBold', w: 600 }, { name: 'Bold', w: 700 }];
  scale = [
    { role: 'Display', sample: 'Timber Office', size: 28, lh: 34, weight: 600, token: '' },
    { role: 'Heading 1', sample: 'Beam calculator', size: 21, lh: 28, weight: 600, token: '' },
    { role: 'Heading 2', sample: 'Geometry Check', size: 17.5, lh: 24, weight: 600, token: '' },
    { role: 'Body', sample: 'Span length between supports', size: 14, lh: 20, weight: 400, token: 'scale/1' },
    { role: 'Label', sample: 'Upgrade Account', size: 14, lh: 20, weight: 500, token: 'button/label/font/weight' },
    { role: 'Small', sample: 'Ratio exceeds 100%, auto-adjust parameters', size: 12, lh: 16, weight: 400, token: '' },
    { role: 'Caption', sample: '15.04.26 · General Thread', size: 10.5, lh: 14, weight: 400, token: 'UI/caption' },
    { role: 'Overline', sample: 'Workspace', size: 10.5, lh: 14, weight: 600, token: '', ls: '.06em', upper: true },
  ];
}

/* ───────── Tokens ───────── */
@Component({
  selector: 'pg-tokens',
  imports: [FormsModule, InputText, IconField, InputIcon, Select],
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">Foundations</div>
        <h1>Design tokens</h1>
        <p class="lede">Every semantic and component token from the Figma file, as exported by PrimeOne. In code they map to CSS variables: <code>button/primary/background</code> → <code>--p-button-primary-background</code>.</p>
      </header>
      <div class="filters">
        <p-iconfield><p-inputicon class="pi pi-search" /><input pInputText id="tok-q" placeholder="Search tokens or values" aria-label="Search tokens" [ngModel]="q()" (ngModelChange)="q.set($event); limit.set(120)" /></p-iconfield>
        <p-select inputId="tok-g" [options]="groups" [ngModel]="group()" (ngModelChange)="group.set($event); limit.set(120)" placeholder="All groups" [showClear]="true" [filter]="true" appendTo="body" ariaLabel="Group" [style]="{ minWidth: '200px' }" />
        <span class="muted">{{ filtered().length.toLocaleString('en') }} tokens</span>
      </div>
      <div class="table-wrap">
        <table class="tokens">
          <thead><tr><th>Token</th><th>CSS variable</th><th>Value</th></tr></thead>
          <tbody>
            @for (t of shown(); track t[0]) {
              <tr>
                <td class="arg-name">{{ t[0] }}</td>
                <td><code class="type">{{ cssVar(t[0]) }}</code></td>
                <td class="tok-val">@if (isColor(t[1])) {<span class="mini" [style.background]="t[1]"></span>}<code>{{ t[1] }}</code></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (filtered().length > shown().length) {
        <div class="more"><button type="button" class="link-btn" (click)="limit.set(limit() + 200)">Show 200 more</button></div>
      }
    </article>
  `,
})
export class TokensPage {
  q = signal('');
  group = signal<string | null>(null);
  limit = signal(120);
  groups = [...new Set(TOKENS.map(([k]) => k.split('/')[0]))].sort();
  filtered = computed(() => {
    const q = this.q().toLowerCase().trim();
    const g = this.group();
    return TOKENS.filter(([k, v]) => (!g || k.split('/')[0] === g) && (!q || k.toLowerCase().includes(q) || v.toLowerCase().includes(q)));
  });
  shown = computed(() => this.filtered().slice(0, this.limit()));
  cssVar(k: string) { return '--p-' + k.replace(/\//g, '-').replace(/\./g, '-'); }
  isColor(v: string) { return /^#|^rgba?\(/.test(v); }
}

/* ───────── Icons ───────── */
@Component({
  selector: 'pg-icons',
  imports: [FormsModule, InputText, IconField, InputIcon],
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">Foundations</div>
        <h1>Icons</h1>
        <p class="lede">PrimeIcons, the set used by the Figma components. Use <code>&lt;i class="pi pi-name"&gt;&lt;/i&gt;</code> or pass the class to a component’s <code>icon</code> input. Click to copy the class.</p>
      </header>
      <div class="filters">
        <p-iconfield><p-inputicon class="pi pi-search" /><input pInputText id="icon-q" placeholder="Search icons" aria-label="Search icons" [ngModel]="q()" (ngModelChange)="q.set($event)" /></p-iconfield>
        <span class="muted">{{ list().length }} icons</span>
      </div>
      <div class="icon-grid">
        @for (i of list(); track i) {
          <button type="button" class="icon-cell" (click)="copy(i)"><i class="pi" [class]="'pi pi-' + i"></i><span>{{ i }}</span></button>
        }
      </div>
    </article>
  `,
})
export class IconsPage {
  private ms = inject(MessageService);
  q = signal('');
  list = computed(() => PRIME_ICONS.filter((i) => i.includes(this.q().toLowerCase().trim())));
  copy(i: string) { copyText(`pi pi-${i}`, this.ms); }
}
