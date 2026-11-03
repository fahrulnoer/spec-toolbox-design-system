import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';

export type SpecCheckStatus = 'pass' | 'fail';

export interface SpecSummaryRow {
  label: string;
  /** Number = percentage (formatted with one decimal and `%`), string = shown as-is. */
  value: number | string;
  /** Override the row status; defaults to pass when value ≤ 100 %. */
  status?: SpecCheckStatus;
}

let nextId = 0;

/**
 * Design-check result card — Figma: ❖ Custom Components → summary-box.
 *
 * ```html
 * <spec-check-summary title="Geometry Check" status="fail" [ratio]="140.3"
 *   message="Ratio exceeds 100%, auto-adjust parameters to resolve."
 *   [rows]="[{ label: 'Timber Member', value: 65.6 }, { label: 'Steel Plate', value: 0.65 }]"
 *   [(expanded)]="showValues" (fix)="autoAdjust()" />
 * ```
 */
@Component({
  selector: 'spec-check-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'spec-check-summary' },
  template: `
    <section class="scs-box" [class.fail]="status() === 'fail'" [attr.aria-labelledby]="id + '-t'">
      <div class="scs-head">
        <h3 class="scs-title" [id]="id + '-t'">{{ title() }}</h3>
        <div class="scs-result" role="status">
          <span class="scs-mark" aria-hidden="true"><i class="pi" [class.pi-check]="status() === 'pass'" [class.pi-times]="status() === 'fail'"></i></span>
          <div class="scs-res-text">
            <strong>{{ status() === 'pass' ? passLabel() : failLabel() }}</strong>
            @if (ratioText()) { <span>{{ ratioText() }}</span> }
          </div>
        </div>
      </div>
      @if (status() === 'fail' && message()) {
        <div class="scs-alert">
          <p>{{ message() }}</p>
          @if (fixable()) {
            <button type="button" class="scs-fix" (click)="fix.emit()" [disabled]="fixing()">
              <i class="pi" [class.pi-sparkles]="!fixing()" [class.pi-spin]="fixing()" [class.pi-spinner]="fixing()" aria-hidden="true"></i>
              {{ fixLabel() }}
              @if (fixCount() > 0) { <span class="scs-count" [attr.aria-label]="fixCount() + ' credit'">+{{ fixCount() }}</span> }
            </button>
          }
        </div>
      }
      @if (rows().length) {
        <div [id]="id + '-rows'" [hidden]="!expanded()">
          @for (r of rows(); track r.label) {
            <div class="scs-row" [class.row-fail]="rowStatus(r) === 'fail'"><span>{{ r.label }}</span><strong>{{ fmt(r.value) }}</strong></div>
          }
        </div>
        <button type="button" class="scs-toggle" (click)="expanded.set(!expanded())" [attr.aria-expanded]="expanded()" [attr.aria-controls]="id + '-rows'">
          {{ expanded() ? 'Hide summary values' : 'Show summary values (' + rows().length + ')' }}
        </button>
      }
    </section>
  `,
  styles: `
    :host { display: block; width: 100%; max-width: 380px; font-family: var(--spec-font, inherit); }
    .scs-box { border: 1px solid var(--spec-border, #edeef2); border-radius: 5px; overflow: hidden; background: var(--p-content-background, #fff); box-shadow: var(--spec-shadow-pass, 0 4px 8px rgb(43 182 115 / .1)); }
    .scs-box.fail { border-color: color-mix(in srgb, var(--spec-danger, #d9424d), transparent 65%); box-shadow: var(--spec-shadow-fail, 0 4px 8px rgb(217 66 77 / .12)); }
    .scs-head { display: flex; min-height: 56px; }
    .scs-title { flex: 1; margin: 0; display: flex; align-items: center; padding: 0 18px; font-size: 13px; font-weight: 500; color: var(--spec-ink-strong, #58595b); border-right: 1px solid var(--spec-border, #edeef2); }
    .scs-result { width: 120px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .scs-mark { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: var(--spec-brand, #2bb673); }
    .fail .scs-mark { background: var(--spec-danger, #d9424d); }
    .scs-mark i { font-size: 12px; font-weight: 700; }
    .scs-res-text { display: flex; flex-direction: column; line-height: 1.2; }
    .scs-res-text strong { font-size: 11px; font-weight: 600; color: var(--spec-brand, #2bb673); }
    .fail .scs-res-text strong { color: var(--spec-danger, #d9424d); }
    .scs-res-text span { font-size: 9px; font-weight: 300; color: var(--spec-ink-strong, #58595b); font-variant-numeric: tabular-nums; }
    .scs-alert { display: flex; align-items: center; gap: 12px; padding: 8px 10px; background: var(--spec-danger-soft, rgb(217 66 77 / .06)); border-top: 1px solid var(--spec-border, #edeef2); }
    .scs-alert p { flex: 1; margin: 0; font-size: 11px; line-height: 15px; color: var(--spec-danger, #d9424d); }
    .scs-fix { display: inline-flex; align-items: center; gap: 4px; border: 0; border-radius: 3px; padding: 4px 8px; font: inherit; font-size: 10px; font-weight: 600; color: #fff; background: var(--spec-brand, #2bb673); cursor: pointer; white-space: nowrap; }
    .scs-fix:hover:not(:disabled) { background: var(--p-primary-600, #22925c); }
    .scs-fix:disabled { opacity: .7; cursor: progress; }
    .scs-fix:focus-visible, .scs-toggle:focus-visible { outline: 2px solid var(--p-primary-color, #2bb673); outline-offset: 2px; }
    .scs-fix i { font-size: 9px; }
    .scs-count { background: rgb(255 255 255 / .4); border-radius: 24px; padding: 1px 5px; font-weight: 500; }
    .scs-row { display: flex; justify-content: space-between; gap: 12px; padding: 9px 14px; border-top: 1px solid var(--spec-border, #edeef2); font-size: 13px; }
    .scs-row span { color: var(--spec-muted, #86888e); font-weight: 300; }
    .scs-row strong { color: var(--spec-brand, #2bb673); font-weight: 600; font-variant-numeric: tabular-nums; }
    .row-fail strong { color: var(--spec-danger, #d9424d); }
    .scs-toggle { display: block; width: 100%; border: 0; border-top: 1px solid var(--spec-border, #edeef2); background: transparent; padding: 9px; font: inherit; font-size: 11px; font-weight: 500; color: var(--p-primary-color, #2bb673); cursor: pointer; }
    .scs-toggle:hover { background: var(--p-content-hover-background, #f1f5f9); }
  `,
})
export class SpecCheckSummary {
  protected readonly id = `spec-check-${++nextId}`;
  /** Check name, e.g. “Geometry Check”. */
  readonly title = input.required<string>();
  /** Result. @default 'fail' */
  readonly status = input<SpecCheckStatus>('fail');
  /** Utilisation ratio. Number = percent (e.g. `140.3` → “140.3%”). */
  readonly ratio = input<number | string | null>(null);
  /** Explanation shown when the check fails. */
  readonly message = input<string>('');
  /** Show the “Fix This” (SPEC Intelligence) action when failing. @default true */
  readonly fixable = input(true, { transform: booleanAttribute });
  /** Credits the fix costs, shown as “+n”. 0 hides the counter. */
  readonly fixCount = input(1);
  /** Show a spinner on the fix button while your handler runs. */
  readonly fixing = input(false, { transform: booleanAttribute });
  /** Member values listed under the card. */
  readonly rows = input<readonly SpecSummaryRow[]>([]);
  /** Whether summary values are visible (two-way: `[(expanded)]`). */
  readonly expanded = model(false);
  readonly passLabel = input('PASS');
  readonly failLabel = input('FAIL');
  readonly fixLabel = input('Fix This');

  /** Emits when “Fix This” is clicked. */
  readonly fix = output<void>();

  protected readonly ratioText = computed(() => this.fmt(this.ratio()));

  protected fmt(v: number | string | null | undefined): string {
    if (v === null || v === undefined || v === '') return '';
    return typeof v === 'number' ? `${v.toLocaleString('en', { maximumFractionDigits: 2 })}%` : v;
  }

  protected rowStatus(r: SpecSummaryRow): SpecCheckStatus {
    return r.status ?? (typeof r.value === 'number' && r.value > 100 ? 'fail' : 'pass');
  }
}
