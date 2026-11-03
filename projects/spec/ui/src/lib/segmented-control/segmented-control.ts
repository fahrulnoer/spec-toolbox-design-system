import {
  ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, computed, forwardRef, input, model, output, signal, viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SpecSegmentedOption<T = unknown> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
}

/** Plain strings are shorthand for `{ label: s, value: s }`. */
export type SpecSegmentedOptions<T = unknown> = readonly (string | SpecSegmentedOption<T>)[];

/**
 * Segmented control — Figma: ❖ Custom Components → Segmented Control (Options 2–4).
 *
 * Switches between 2–4 views. Works with `[(value)]`, `ngModel` and reactive forms.
 * Keyboard: ←/→ (or ↑/↓) move the selection, Home/End jump to the first/last option.
 *
 * ```html
 * <spec-segmented [options]="['Inputs', 'Outputs', 'Report']" [(value)]="view" />
 * <spec-segmented [options]="units" formControlName="unit" ariaLabel="Units" />
 * ```
 */
@Component({
  selector: 'spec-segmented',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SpecSegmentedControl), multi: true }],
  host: { class: 'spec-segmented', '[class.spec-segmented-fluid]': 'fluid()' },
  template: `
    <div class="ssg-seg" role="radiogroup" [attr.aria-label]="ariaLabel()" [attr.aria-disabled]="isDisabled() || null" [class.small]="size() === 'small'">
      @for (o of items(); track o.value; let i = $index) {
        <button #btn type="button" role="radio" class="ssg-seg-item"
          [class.selected]="i === selectedIndex()"
          [attr.aria-checked]="i === selectedIndex()"
          [attr.tabindex]="i === focusIndex() ? 0 : -1"
          [disabled]="isDisabled() || o.disabled"
          (click)="select(i)" (keydown)="onKey($event, i)" (blur)="onTouched()">
          @if (o.icon) { <i [class]="o.icon" aria-hidden="true"></i> }
          {{ o.label }}
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: inline-block; max-width: 100%; }
    :host(.spec-segmented-fluid) { display: block; }
    .ssg-seg { display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px; background: var(--spec-subtle-bg, #f1f5f9); max-width: 100%; overflow-x: auto; }
    :host(.spec-segmented-fluid) .ssg-seg { display: flex; }
    :host(.spec-segmented-fluid) .ssg-seg-item { flex: 1; }
    .ssg-seg-item { display: inline-flex; align-items: center; justify-content: center; gap: 6px; font: 400 14px/20px var(--spec-font, inherit);
      border: 1px solid transparent; background: transparent; color: var(--p-surface-400, #94a3b8); padding: 6px 12px; border-radius: 6px;
      cursor: pointer; white-space: nowrap; transition: background-color .15s, color .15s; }
    .small .ssg-seg-item { font-size: 12px; padding: 3px 10px; }
    .ssg-seg-item:hover:not(.selected):not(:disabled) { color: var(--p-text-muted-color, #64748b); }
    .ssg-seg-item.selected { background: var(--spec-raised-bg, #fff); color: var(--p-text-color, #334155); border-color: var(--spec-raised-border, #e2e8f0); box-shadow: 0 1px 2px rgb(15 23 42 / .06); }
    .ssg-seg-item:focus-visible { outline: 1px solid var(--p-primary-color, #2bb673); outline-offset: 1px; }
    .ssg-seg-item:disabled { cursor: not-allowed; opacity: .55; }
    @media (prefers-reduced-motion: reduce) { .ssg-seg-item { transition: none; } }
  `,
})
export class SpecSegmentedControl<T = unknown> implements ControlValueAccessor {
  /** Options as strings or `{ label, value, icon?, disabled? }`. */
  readonly options = input.required<SpecSegmentedOptions<T>>();
  /** Selected value (two-way: `[(value)]`). Ignored when a form control is attached. */
  readonly value = model<T | string | null>(null);
  /** Stretch to the parent width with equal-width options. */
  readonly fluid = input(false, { transform: booleanAttribute });
  /** Disable all options. Forms can also disable via `control.disable()`. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Size. @default 'medium' */
  readonly size = input<'small' | 'medium'>('medium');
  /** Accessible group label. Required when no visible label is associated. */
  readonly ariaLabel = input<string>('Options');
  /** Emits after the user picks an option. */
  readonly changed = output<T | string>();

  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('btn');
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly items = computed<SpecSegmentedOption<T | string>[]>(() =>
    this.options().map((o) => (typeof o === 'string' ? { label: o, value: o } : o)),
  );
  protected readonly selectedIndex = computed(() => this.items().findIndex((o) => Object.is(o.value, this.value())));
  protected readonly focusIndex = computed(() => {
    const i = this.selectedIndex();
    return i >= 0 ? i : this.items().findIndex((o) => !o.disabled);
  });

  private onChange: (v: unknown) => void = () => {};
  protected onTouched: () => void = () => {};

  protected select(i: number) {
    const o = this.items()[i];
    if (!o || o.disabled || this.isDisabled() || i === this.selectedIndex()) return;
    this.value.set(o.value);
    this.onChange(o.value);
    this.changed.emit(o.value);
  }

  protected onKey(e: KeyboardEvent, i: number) {
    const n = this.items().length;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let next = -1;
    if (step) {
      next = i;
      for (let k = 0; k < n; k++) {
        next = (next + step + n) % n;
        if (!this.items()[next].disabled) break;
      }
    } else if (e.key === 'Home') next = this.items().findIndex((o) => !o.disabled);
    else if (e.key === 'End') next = n - 1 - [...this.items()].reverse().findIndex((o) => !o.disabled);
    if (next < 0) return;
    e.preventDefault();
    this.select(next);
    this.buttons()[next]?.nativeElement.focus();
  }

  writeValue(v: T | string | null): void { this.value.set(v ?? null); }
  registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.formDisabled.set(d); }
}
