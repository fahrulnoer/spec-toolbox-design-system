import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { SpecLogo } from '../logo/logo';

export interface SpecBreadcrumbItem {
  label: string;
  /** Optional href. Without it the item is a button that emits `breadcrumbClick`. */
  url?: string;
}

/**
 * App top bar — Figma: ❖ Custom Components → Header.
 *
 * Project content goes in the breadcrumb; put extra controls in the `[specHeaderActions]` slot.
 *
 * ```html
 * <spec-app-header [breadcrumb]="['My Project', 'Timber Office']" user="Adam Jones" [credits]="12"
 *   (upgrade)="router.navigate(['/billing'])" (settings)="openSettings()">
 *   <p-button specHeaderActions icon="pi pi-bell" text rounded ariaLabel="Notifications" />
 * </spec-app-header>
 * ```
 */
@Component({
  selector: 'spec-app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpecLogo],
  host: { class: 'spec-app-header' },
  template: `
    <header class="sah-hdr">
      @if (showLogo()) { <spec-logo variant="white" [height]="18" /> }
      <nav class="sah-crumbs" aria-label="Breadcrumb">
        <ol>
          @for (c of items(); track $index; let last = $last; let i = $index) {
            <li>
              @if (last) {
                <span aria-current="page">{{ c.label }}</span>
              } @else if (c.url) {
                <a [href]="c.url">{{ c.label }}</a>
              } @else {
                <button type="button" (click)="breadcrumbClick.emit({ item: c, index: i })">{{ c.label }}</button>
              }
              @if (!last) { <i class="pi pi-angle-right" aria-hidden="true"></i> }
            </li>
          }
        </ol>
      </nav>
      <div class="sah-right">
        <ng-content select="[specHeaderActions]" />
        @if (showUpgrade()) { <button type="button" class="sah-upgrade" (click)="upgrade.emit()">{{ upgradeLabel() }}</button> }
        @if (credits() !== null) {
          <button type="button" class="sah-credits" (click)="creditsClick.emit()" [attr.aria-label]="credits() + ' SPEC Intelligence credits'">
            <i class="pi pi-sparkles" aria-hidden="true"></i>{{ credits() }}
          </button>
        }
        @if (user()) { <span class="sah-user">{{ user() }}</span> }
        <button type="button" class="sah-gear" aria-label="Settings" (click)="settings.emit()"><i class="pi pi-cog" aria-hidden="true"></i></button>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; width: 100%; font-family: var(--spec-font, inherit); }
    .sah-hdr { display: flex; align-items: center; gap: 20px; height: 55px; padding: 0 20px; background: var(--spec-brand, #2bb673); color: var(--spec-on-brand, #fff); border-radius: var(--spec-header-radius, 0); }
    .sah-crumbs { min-width: 0; overflow: hidden; }
    ol { display: flex; align-items: center; gap: 10px; margin: 0; padding: 0; list-style: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
    li { display: flex; align-items: center; gap: 10px; min-width: 0; }
    li span, li a, li button { overflow: hidden; text-overflow: ellipsis; }
    li a, li button { color: inherit; text-decoration: none; border: 0; background: none; font: inherit; padding: 0; cursor: pointer; opacity: .9; }
    li a:hover, li button:hover { opacity: 1; text-decoration: underline; }
    li i { font-size: 12px; opacity: .9; }
    .sah-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
    .sah-upgrade { border: 0; background: #fff; color: var(--spec-brand, #2bb673); font: inherit; font-size: 13px; font-weight: 500; padding: 7px 12px; border-radius: 4px; cursor: pointer; white-space: nowrap; }
    .sah-upgrade:hover { background: var(--p-primary-50, #eaf8f1); }
    .sah-credits { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border: 0; border-radius: 999px; background: rgb(255 255 255 / .25); color: inherit; font: inherit; font-size: 12px; font-variant-numeric: tabular-nums; cursor: pointer; }
    .sah-credits i { font-size: 11px; }
    .sah-user { font-size: 13px; font-weight: 500; white-space: nowrap; }
    .sah-gear { border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 18px; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 6px; }
    .sah-gear:hover { background: rgb(255 255 255 / .15); }
    button:focus-visible, a:focus-visible { outline: 2px solid #fff; outline-offset: 2px; border-radius: 4px; }
    @media (max-width: 720px) { .sah-user, .sah-upgrade { display: none; } .sah-hdr { gap: 12px; padding: 0 12px; } }
  `,
})
export class SpecAppHeader {
  /** Breadcrumb trail; the last item is the current page. */
  readonly breadcrumb = input<readonly (string | SpecBreadcrumbItem)[]>([]);
  /** Signed-in user's display name. */
  readonly user = input('');
  /** SPEC Intelligence credits. `null` hides the pill. */
  readonly credits = input<number | null, unknown>(null, { transform: (v: unknown) => (v === null || v === undefined || v === '' ? null : numberAttribute(v)) });
  /** Show the “Upgrade Account” button (free plans). @default true */
  readonly showUpgrade = input(true, { transform: booleanAttribute });
  readonly upgradeLabel = input('Upgrade Account');
  /** Show the logo, e.g. when the side bar is collapsed. */
  readonly showLogo = input(false, { transform: booleanAttribute });

  readonly breadcrumbClick = output<{ item: SpecBreadcrumbItem; index: number }>();
  readonly upgrade = output<void>();
  readonly creditsClick = output<void>();
  readonly settings = output<void>();

  protected readonly items = computed<SpecBreadcrumbItem[]>(() => this.breadcrumb().map((b) => (typeof b === 'string' ? { label: b } : b)));
}
