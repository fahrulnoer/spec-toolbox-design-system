import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SpecStatusSeverity = 'success' | 'error' | 'warning' | 'neutral';

/**
 * Outlined status pill — Figma: ❖ Custom Components → Default Badge (Success / Error / Warning).
 *
 * Use for short statuses (Resolved, Failed, Pending). Use PrimeNG `p-tag` for filled labels
 * and `p-badge` for counts.
 *
 * ```html
 * <spec-status-badge severity="error" value="Failed" />
 * <spec-status-badge severity="success">Resolved</spec-status-badge>
 * ```
 */
@Component({
  selector: 'spec-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'spec-status-badge' },
  template: `
    <span class="ssb-sb" [class]="'ssb-sb ssb-sb-' + severity()">
      @if (dot()) { <span class="ssb-d" aria-hidden="true"></span> }
      @if (value()) { {{ value() }} } @else { <ng-content /> }
      @if (chevron()) { <i class="pi pi-chevron-down" aria-hidden="true"></i> }
    </span>
  `,
  styles: `
    :host { display: inline-flex; vertical-align: middle; }
    .ssb-sb { display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 8px; border-radius: 999px;
      border: 1px solid currentColor; font: 500 12px/1 var(--spec-font, inherit); white-space: nowrap;
      background: color-mix(in srgb, currentColor, transparent 92%); }
    .ssb-sb i { font-size: 8px; }
    .ssb-d { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .ssb-sb-success { color: var(--spec-success-ink, #22925c); }
    .ssb-sb-error { color: var(--spec-danger, #d9424d); }
    .ssb-sb-warning { color: var(--spec-warning-ink, #f59e0b); }
    .ssb-sb-neutral { color: var(--spec-muted, #86888e); }
  `,
})
export class SpecStatusBadge {
  /** Badge text. When empty, projected content is rendered instead. */
  readonly value = input<string>('');
  /** Colour role. @default 'success' */
  readonly severity = input<SpecStatusSeverity>('success');
  /** Leading status dot. */
  readonly dot = input(false);
  /** Trailing chevron, for badges that open a status menu. */
  readonly chevron = input(false);
}
