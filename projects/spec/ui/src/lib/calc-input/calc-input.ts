import {
  ChangeDetectionStrategy, Component, DestroyRef, OnInit, booleanAttribute, computed, inject, input, model, numberAttribute, output, signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';

export type SpecCalcInputState = 'default' | 'readonly' | 'disabled' | 'warning';
export type SpecCalcInputValue = number | string | null;

let nextId = 0;

/**
 * Calculator parameter input — Figma: ❖ Custom Components → input-calculator.
 *
 * Label floats onto the border once a value exists, the unit sits inside the field and the
 * info button explains the parameter. Works with `[(value)]`, `ngModel` and reactive forms;
 * when bound to a form control it shows the warning state automatically once the control is
 * invalid and touched.
 *
 * ```html
 * <spec-calc-input label="Span length" unit="mm" [(value)]="span" info="Clear span between supports." />
 *
 * <spec-calc-input label="Member depth" unit="mm" formControlName="depth"
 *   warning="Depth must be between 90 and 600 mm." [min]="90" [max]="600" />
 * ```
 */
@Component({
  selector: 'spec-calc-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip],
  host: { class: 'spec-calc-input' },
  template: `
    <div class="sci-calc" [class]="'sci-calc sci-is-' + visualState()" [class.filled]="hasValue()" [class.focused]="focused()">
      <div class="sci-field">
        <input class="sci-ctl" [id]="inputId()" [attr.name]="name() || null"
          [type]="type()" [attr.inputmode]="type() === 'number' ? 'decimal' : null"
          [value]="display()" [placeholder]="label()"
          [attr.min]="type() === 'number' ? min() ?? null : null" [attr.max]="type() === 'number' ? max() ?? null : null" [attr.step]="type() === 'number' ? step() : null"
          [disabled]="isDisabled()" [readOnly]="state() === 'readonly'"
          [attr.aria-invalid]="visualState() === 'warning' || null"
          [attr.aria-describedby]="describedBy()"
          autocomplete="off"
          (input)="onInput($event)" (focus)="focused.set(true)" (blur)="onBlur()" />
        <label [for]="inputId()">{{ label() }}</label>
        @if (unit()) { <span class="sci-unit" [id]="inputId() + '-unit'">({{ unit() }})</span> }
      </div>
      @if (info()) {
        <button type="button" class="sci-info" [pTooltip]="info()" tooltipPosition="top" [attr.aria-label]="'About ' + label()"
          [attr.aria-describedby]="inputId() + '-info'" (click)="infoClick.emit()">
          <i class="pi pi-info" aria-hidden="true"></i>
        </button>
        <span class="sci-sr-only" [id]="inputId() + '-info'">{{ info() }}</span>
      }
    </div>
    @if (visualState() === 'warning' && warning()) {
      <small class="sci-warn" [id]="inputId() + '-warn'" role="alert"><i class="pi pi-exclamation-triangle" aria-hidden="true"></i>{{ warning() }}</small>
    }
  `,
  styles: `
    :host { display: block; width: 100%; max-width: 280px; font-family: var(--spec-font, inherit); }
    .sci-calc { position: relative; display: flex; align-items: stretch; height: 40px; border: 1px solid var(--p-form-field-border-color, #cbd5e1);
      border-radius: var(--spec-radius, 6px); background: var(--p-form-field-background, #fff); transition: border-color .15s; }
    .sci-calc:hover:not(.sci-is-disabled):not(.sci-is-readonly) { border-color: var(--p-form-field-hover-border-color, #94a3b8); }
    .sci-calc.focused { border-color: var(--p-form-field-focus-border-color, #2bb673); }
    .sci-field { position: relative; flex: 1; display: flex; align-items: center; min-width: 0; }
    .sci-ctl { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; font: inherit; font-size: 14px;
      color: var(--p-form-field-color, #334155); padding: 0 8px 0 12px; font-variant-numeric: tabular-nums; -moz-appearance: textfield; }
    .sci-ctl::-webkit-outer-spin-button, .sci-ctl::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .sci-ctl::placeholder { color: var(--p-form-field-placeholder-color, #64748b); }
    label { position: absolute; left: 8px; top: -8px; padding: 0 4px; font-size: 10.5px; line-height: 14px; color: var(--p-text-muted-color, #64748b);
      background: var(--p-form-field-background, #fff); border-radius: 2px; opacity: 0; transform: translateY(4px); transition: opacity .15s, transform .15s; pointer-events: none; white-space: nowrap; }
    .filled label, .focused label { opacity: 1; transform: none; }
    .sci-unit { padding-right: 10px; color: var(--p-form-field-placeholder-color, #64748b); font-size: 14px; white-space: nowrap; }
    .sci-info { flex-shrink: 0; width: 32px; border: 0; border-left: 1px solid var(--p-form-field-border-color, #cbd5e1); background: transparent;
      display: grid; place-items: center; cursor: help; border-radius: 0 var(--spec-radius, 6px) var(--spec-radius, 6px) 0; }
    .sci-info i { width: 14px; height: 14px; border-radius: 50%; background: var(--spec-info-bg, #aae2c7); color: var(--spec-info-ink, #1a6d45);
      font-size: 8px; font-weight: 700; display: grid; place-items: center; }
    .sci-info:focus-visible { outline: 1px solid var(--p-primary-color, #2bb673); outline-offset: -2px; }
    .sci-is-disabled { background: var(--p-form-field-disabled-background, #e2e8f0); }
    .sci-is-disabled .sci-ctl, .sci-is-disabled .sci-unit { color: var(--p-form-field-disabled-color, #64748b); cursor: not-allowed; }
    .sci-is-disabled label { background: linear-gradient(var(--p-form-field-background, #fff) 50%, var(--p-form-field-disabled-background, #e2e8f0) 50%); }
    .sci-is-readonly { background: var(--p-form-field-filled-background, #f8fafc); }
    .sci-is-readonly label { background: linear-gradient(var(--p-form-field-background, #fff) 50%, var(--p-form-field-filled-background, #f8fafc) 50%); }
    .sci-is-warning, .sci-is-warning:hover, .sci-is-warning.focused { border-color: var(--p-form-field-invalid-border-color, #f87171) !important; }
    .sci-is-warning .sci-info { border-left-color: var(--p-form-field-invalid-border-color, #f87171); }
    .sci-warn { display: flex; gap: 6px; align-items: center; margin-top: 6px; color: var(--spec-danger, #d9424d); font-size: 12px; line-height: 16px; }
    .sci-warn i { font-size: 11px; }
    .sci-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    @media (prefers-reduced-motion: reduce) { label, .sci-calc { transition: none; } }
  `,
})
export class SpecCalcInput implements ControlValueAccessor, OnInit {
  /** Parameter name. Shown as placeholder, then floats onto the border. */
  readonly label = input.required<string>();
  /** Unit of measure shown in brackets, e.g. `mm`, `kN`, `kPa`. Empty hides it. */
  readonly unit = input<string>('');
  /** Current value (two-way: `[(value)]`). Numbers for `type="number"`, strings for `type="text"`. */
  readonly value = model<SpecCalcInputValue>(null);
  /** Visual state (Figma variant “State”). Forms can also set disabled / warning. @default 'default' */
  readonly state = input<SpecCalcInputState>('default');
  /** Tooltip text for the info button. Empty hides the button. */
  readonly info = input<string>('');
  /** Message shown below the field in the warning state. */
  readonly warning = input<string>('');
  /** Input type. @default 'number' */
  readonly type = input<'number' | 'text'>('number');
  readonly min = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly max = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly step = input<number | 'any', unknown>('any', { transform: (v: unknown) => (v === 'any' ? 'any' : numberAttribute(v, 1)) });
  /** Disable the field (same as `state="disabled"`). */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Id of the native input; auto-generated when omitted. */
  readonly inputId = input(`spec-calc-${++nextId}`);
  readonly name = input<string>('');

  /** Emits when the info button is clicked (the tooltip also shows on hover/focus). */
  readonly infoClick = output<void>();
  /** Emits on blur, after `touched` is set. */
  readonly blurred = output<void>();

  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly formDisabled = signal(false);
  private readonly controlInvalid = signal(false);
  protected readonly focused = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled() || this.state() === 'disabled');
  protected readonly visualState = computed<SpecCalcInputState>(() => {
    if (this.isDisabled()) return 'disabled';
    if (this.state() === 'warning' || this.controlInvalid()) return 'warning';
    return this.state();
  });
  protected readonly hasValue = computed(() => this.value() !== null && this.value() !== '');
  protected readonly display = computed(() => (this.value() ?? '') as string | number);
  protected readonly describedBy = computed(() => {
    const ids = [];
    if (this.unit()) ids.push(this.inputId() + '-unit');
    if (this.visualState() === 'warning' && this.warning()) ids.push(this.inputId() + '-warn');
    return ids.join(' ') || null;
  });

  private onChange: (v: SpecCalcInputValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    const ctrl = this.ngControl?.control;
    if (!ctrl) return;
    const sync = () => this.controlInvalid.set(ctrl.invalid && (ctrl.touched || ctrl.dirty));
    const sub = ctrl.events.subscribe(sync);
    sync();
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected onInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const v: SpecCalcInputValue = el.value === '' ? null : this.type() === 'number' ? (Number.isNaN(el.valueAsNumber) ? null : el.valueAsNumber) : el.value;
    this.value.set(v);
    this.onChange(v);
  }

  protected onBlur() {
    this.focused.set(false);
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(v: SpecCalcInputValue): void { this.value.set(v ?? null); }
  registerOnChange(fn: (v: SpecCalcInputValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.formDisabled.set(d); }
}

function optionalNumber(v: unknown): number | undefined {
  return v === undefined || v === null || v === '' ? undefined : numberAttribute(v);
}
