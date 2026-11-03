import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LOGO_COLOR, LOGO_WHITE } from './logo-data';

export type SpecLogoVariant = 'color' | 'white';

/**
 * SPEC Toolbox wordmark. Use `white` on the brand-green bar and dark surfaces.
 *
 * ```html
 * <spec-logo variant="white" [height]="18" />
 * ```
 */
@Component({
  selector: 'spec-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'spec-logo' },
  template: `<img [src]="src()" [alt]="alt()" [style.height.px]="height()" [attr.width]="width()" [attr.height]="height()" />`,
  styles: `:host { display: inline-flex; line-height: 0; } img { width: auto; display: block; }`,
})
export class SpecLogo {
  /** Colour variant. @default 'color' */
  readonly variant = input<SpecLogoVariant>('color');
  /** Rendered height in px; width keeps the 196 × 22 ratio. @default 22 */
  readonly height = input(22);
  /** Accessible name. Pass `''` when the logo sits next to visible product text. */
  readonly alt = input('SPEC Toolbox');

  protected readonly src = computed(() => (this.variant() === 'white' ? LOGO_WHITE : LOGO_COLOR));
  protected readonly width = computed(() => Math.round((this.height() * 196) / 22));
}
