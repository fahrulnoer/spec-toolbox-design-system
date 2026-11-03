import { ChangeDetectionStrategy, Component, booleanAttribute, input, model, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SpecLogo } from '../logo/logo';

let nextId = 0;

export interface SpecNavItem {
  id: string;
  label: string;
  /** PrimeIcons class, e.g. `pi pi-folder`. */
  icon?: string;
  /** Count badge; 0 / undefined hides it. */
  badge?: number | string;
  /** Optional href. Without it the item is a button and only emits `itemSelect`. */
  url?: string;
  disabled?: boolean;
}

export interface SpecNavSection {
  label: string;
  items: readonly SpecNavItem[];
}

export type SpecWorkspaceType = 'Personal' | 'Company' | 'Suppliers' | 'Root';

export interface SpecWorkspace {
  name: string;
  type: SpecWorkspaceType;
  /** Member level, e.g. Basic, Pro, Team, Enterprise, Advanced, Premium. */
  level?: string;
}

/**
 * App side bar — Figma: ❖ Custom Components → Side Bar (Type × Member level).
 *
 * Fully data-driven: pass `sections` for the main area and `footerSections` for the bottom
 * (Account). Bind `[(activeId)]` to highlight the current page.
 *
 * ```html
 * <spec-side-nav [workspace]="{ name: 'Personal Project', type: 'Personal', level: 'Pro' }"
 *   [sections]="nav" [footerSections]="account" [(activeId)]="current"
 *   (itemSelect)="router.navigate([$event.id])" (workspaceClick)="wsMenu.toggle($event)" />
 * ```
 */
@Component({
  selector: 'spec-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpecLogo, NgTemplateOutlet],
  host: { class: 'spec-side-nav' },
  template: `
    <aside class="ssn-sn" [attr.aria-label]="ariaLabel()">
      <div class="ssn-brand">
        <spec-logo variant="white" [height]="18" />
        @if (showMenuButton()) {
          <button type="button" class="ssn-burger" aria-label="Toggle navigation" (click)="menuToggle.emit()"><i class="pi pi-bars" aria-hidden="true"></i></button>
        }
      </div>
      @if (workspace(); as ws) {
        <div class="ssn-sec">
          <div class="ssn-lbl" [id]="uid + '-ws'">Workspace</div>
          <button type="button" class="ssn-ws" aria-haspopup="menu" [attr.aria-describedby]="uid + '-ws'" (click)="workspaceClick.emit($event)">
            <i [class]="ws.type === 'Personal' ? 'pi pi-user' : ws.type === 'Suppliers' ? 'pi pi-box' : 'pi pi-building'" aria-hidden="true"></i>
            <span class="ssn-ws-name">{{ ws.name }}</span>
            @if (ws.level) { <span class="ssn-lvl">{{ ws.level }}</span> }
            <i class="pi pi-chevron-down ssn-end" aria-hidden="true"></i>
          </button>
        </div>
      }
      <nav class="ssn-main">
        @for (s of sections(); track s.label) { <ng-container *ngTemplateOutlet="section; context: { $implicit: s }" /> }
      </nav>
      @if (footerSections().length) {
        <nav class="ssn-foot">
          @for (s of footerSections(); track s.label) { <ng-container *ngTemplateOutlet="section; context: { $implicit: s }" /> }
        </nav>
      }
    </aside>

    <ng-template #section let-s>
      <div class="ssn-sec">
        <div class="ssn-lbl">{{ s.label }}</div>
        <ul>
          @for (i of s.items; track i.id) {
            <li>
              @if (i.url && !i.disabled) {
                <a class="ssn-item" [href]="i.url" [class.active]="i.id === activeId()" [attr.aria-current]="i.id === activeId() ? 'page' : null" (click)="pick(i)">
                  <ng-container *ngTemplateOutlet="itemBody; context: { $implicit: i }" />
                </a>
              } @else {
                <button type="button" class="ssn-item" [class.active]="i.id === activeId()" [attr.aria-current]="i.id === activeId() ? 'page' : null" [disabled]="i.disabled" (click)="pick(i)">
                  <ng-container *ngTemplateOutlet="itemBody; context: { $implicit: i }" />
                </button>
              }
            </li>
          }
        </ul>
      </div>
    </ng-template>

    <ng-template #itemBody let-i>
      @if (i.icon) { <i [class]="i.icon" aria-hidden="true"></i> }
      <span class="ssn-item-label">{{ i.label }}</span>
      @if (i.badge) { <span class="ssn-cnt">{{ i.badge }}</span> }
    </ng-template>
  `,
  styles: `
    :host { display: block; height: 100%; font-family: var(--spec-font, inherit); }
    .ssn-sn { width: var(--spec-side-nav-width, 264px); height: 100%; min-height: 420px; display: flex; flex-direction: column; background: var(--p-content-background, #fff); border-right: 1px solid var(--spec-border, #edeef2); overflow: hidden; }
    .ssn-brand { height: 55px; flex-shrink: 0; background: var(--spec-brand, #2bb673); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; color: var(--spec-on-brand, #fff); }
    .ssn-burger { border: 0; background: none; color: inherit; font-size: 20px; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: grid; place-items: center; }
    .ssn-burger:hover { background: rgb(255 255 255 / .15); }
    .ssn-main { flex: 1; overflow-y: auto; }
    .ssn-sec { padding: 12px 8px; display: grid; gap: 2px; align-content: start; }
    .ssn-foot, .ssn-main + .ssn-foot { border-top: 1px solid var(--spec-border, #edeef2); }
    .ssn-sec + .ssn-sec { border-top: 1px solid var(--spec-border, #edeef2); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
    .ssn-lbl { font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--p-primary-color, #2bb673); padding: 0 4px 6px; }
    .ssn-ws { display: flex; align-items: center; gap: 8px; width: 100%; border: 0; border-radius: 6px; background: var(--spec-subtle-bg, #f1f5f9); padding: 7px 8px; font: inherit; font-size: 13px; color: var(--p-text-color, #334155); cursor: pointer; text-align: left; }
    .ssn-ws-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ssn-ws .ssn-end { margin-left: auto; font-size: 11px; }
    .ssn-lvl { font-size: 11px; padding: 1px 7px; border-radius: 6px; background: var(--spec-level-bg, #d5f0e3); color: var(--spec-level-ink, #1a6d45); }
    .ssn-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px 10px; border: 0; border-radius: 6px; background: none; font: inherit; font-size: 13px; color: var(--p-text-muted-color, #64748b); cursor: pointer; text-decoration: none; text-align: left; }
    .ssn-item:hover:not(:disabled), .ssn-item.active { background: var(--p-content-hover-background, #f1f5f9); color: var(--p-text-color, #334155); }
    .ssn-item.active { font-weight: 500; }
    .ssn-item:disabled { opacity: .5; cursor: not-allowed; }
    .ssn-item i { font-size: 14px; color: var(--p-surface-400, #94a3b8); }
    .ssn-item.active i { color: var(--p-primary-color, #2bb673); }
    .ssn-item-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ssn-cnt { font-size: 10.5px; font-weight: 700; min-width: 18px; height: 18px; display: grid; place-items: center; border-radius: 999px; background: var(--spec-subtle-bg, #f1f5f9); color: var(--p-text-muted-color, #64748b); padding: 0 5px; }
    button:focus-visible, a:focus-visible { outline: 2px solid var(--p-primary-color, #2bb673); outline-offset: -2px; }
    .ssn-brand button:focus-visible { outline-color: #fff; }
  `,
})
export class SpecSideNav {
  protected readonly uid = `spec-nav-${++nextId}`;
  readonly workspace = input<SpecWorkspace | null>(null);
  readonly sections = input<readonly SpecNavSection[]>([]);
  /** Sections pinned to the bottom, e.g. Account. */
  readonly footerSections = input<readonly SpecNavSection[]>([]);
  /** Id of the active item (two-way: `[(activeId)]`). */
  readonly activeId = model<string | null>(null);
  readonly showMenuButton = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Main navigation');

  /** Emits the clicked item (after `activeId` updates). */
  readonly itemSelect = output<SpecNavItem>();
  /** Workspace switcher clicked. Emits the event to anchor a `p-menu` / `p-popover`. */
  readonly workspaceClick = output<MouseEvent>();
  /** Burger button clicked. */
  readonly menuToggle = output<void>();

  protected pick(i: SpecNavItem) {
    if (i.disabled) return;
    this.activeId.set(i.id);
    this.itemSelect.emit(i);
  }
}
