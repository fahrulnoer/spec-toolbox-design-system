import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { SpecStatusBadge } from '../status-badge/status-badge';

export interface SpecParticipant {
  name: string;
  /** Defaults to the first letters of the first two words of `name`. */
  initials?: string;
  /** Avatar background. Defaults to a colour derived from `name`. */
  color?: string;
  image?: string;
}

export type SpecThreadStatus = 'resolved' | 'open';

const AVATAR_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

/**
 * Discussion thread summary — Figma: ❖ Custom Components → Discussion Box (Default, small).
 *
 * ```html
 * <spec-discussion-card title="Wind region type?" [date]="thread.createdAt" status="resolved"
 *   thread="General Thread" author="William MacDonald" [excerpt]="thread.lastMessage"
 *   [replies]="4" [participants]="thread.people" (opened)="openThread(thread)" (menu)="threadMenu.toggle($event)" />
 * ```
 */
@Component({
  selector: 'spec-discussion-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarGroup, SpecStatusBadge, DatePipe],
  host: { class: 'spec-discussion-card' },
  template: `
    <article class="sdc-disc" [class.compact]="compact()">
      <div class="sdc-top">
        <h3><button type="button" class="sdc-title-btn" (click)="opened.emit()">{{ title() }}</button></h3>
        <div class="sdc-side">
          @if (participants().length) {
            <p-avatar-group [attr.aria-label]="participantLabel()">
              @for (p of shown(); track p.name) {
                <p-avatar [label]="p.image ? undefined : initials(p)" [image]="p.image" shape="circle" [attr.title]="p.name"
                  [style]="{ background: p.color ?? colorFor(p.name), color: '#fff', 'font-size': '11px' }" />
              }
              @if (hidden() > 0) { <p-avatar [label]="'+' + hidden()" shape="circle" [style]="{ 'font-size': '11px' }" /> }
            </p-avatar-group>
          }
          <span class="sdc-replies">{{ replies() }} {{ replies() === 1 ? 'reply' : 'replies' }}</span>
          <button type="button" class="sdc-more" aria-label="Thread actions" aria-haspopup="menu" (click)="menu.emit($event)"><i class="pi pi-ellipsis-h" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="sdc-meta">
        @if (date()) { <time [attr.datetime]="isoDate()">{{ isDate() ? (date() | date: dateFormat()) : date() }}</time><span class="dot" aria-hidden="true">•</span> }
        <button type="button" class="sdc-status-btn" (click)="statusClick.emit()" [attr.aria-label]="'Status: ' + statusLabel() + '. Change status'">
          <spec-status-badge [severity]="status() === 'resolved' ? 'success' : 'warning'" [value]="statusLabel()" [chevron]="true" />
        </button>
        @if (thread()) { <span class="sdc-thread">{{ thread() }}</span> }
      </div>
      @if (excerpt()) { <p class="sdc-excerpt">@if (author()) {<strong>{{ author() }}</strong>} {{ excerpt() }}</p> }
    </article>
  `,
  styles: `
    :host { display: block; width: 100%; font-family: var(--spec-font, inherit); }
    .sdc-disc { border: 1px solid var(--spec-border, #edeef2); border-radius: 12px; padding: 14px 16px; background: var(--p-content-background, #fff); display: grid; gap: 8px; }
    .compact { max-width: 460px; }
    .sdc-top { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
    h3 { margin: 0; min-width: 0; }
    .sdc-title-btn { border: 0; background: none; padding: 0; font: inherit; font-size: 15px; font-weight: 600; color: var(--p-text-color, #334155); cursor: pointer; text-align: left; }
    .sdc-title-btn:hover { color: var(--p-primary-color, #2bb673); }
    .sdc-title-btn:focus-visible, .sdc-more:focus-visible, .sdc-status-btn:focus-visible { outline: 2px solid var(--p-primary-color, #2bb673); outline-offset: 2px; border-radius: 4px; }
    .sdc-side { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .sdc-replies { font-size: 12px; color: var(--p-text-muted-color, #64748b); white-space: nowrap; }
    .sdc-more { border: 0; background: transparent; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; color: var(--p-text-color, #334155); }
    .sdc-more:hover { background: var(--p-content-hover-background, #f1f5f9); }
    .sdc-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--p-text-muted-color, #64748b); }
    .sdc-status-btn { border: 0; background: none; padding: 0; cursor: pointer; display: inline-flex; }
    .sdc-thread { border: 1px solid var(--p-surface-500, #64748b); border-radius: 999px; padding: 1px 8px; font-size: 11px; color: var(--p-text-color, #334155); }
    .sdc-excerpt { margin: 0; font-size: 13px; color: var(--p-text-muted-color, #64748b); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sdc-excerpt strong { color: var(--p-text-color, #334155); font-weight: 500; margin-right: 4px; }
    @media (max-width: 520px) { .sdc-top { flex-direction: column; gap: 6px; } }
  `,
})
export class SpecDiscussionCard {
  /** Thread question. */
  readonly title = input.required<string>();
  /** Date or pre-formatted string. Dates use `dateFormat`. */
  readonly date = input<Date | string | number | null>(null);
  /** Angular date format. @default 'dd.MM.yy' */
  readonly dateFormat = input('dd.MM.yy');
  /** Thread status. @default 'open' */
  readonly status = input<SpecThreadStatus>('open');
  /** Thread category, e.g. “General Thread”. */
  readonly thread = input('');
  /** Author of the latest message. */
  readonly author = input('');
  /** Latest message; truncated to one line. */
  readonly excerpt = input('');
  readonly replies = input(0, { transform: numberAttribute });
  readonly participants = input<readonly SpecParticipant[]>([]);
  /** Avatars shown before collapsing into “+n”. @default 3 */
  readonly maxAvatars = input(3, { transform: numberAttribute });
  /** Small variant (max 460px). */
  readonly compact = input(false, { transform: booleanAttribute });

  /** Title clicked — open the thread. */
  readonly opened = output<void>();
  /** Status badge clicked — open a status menu. */
  readonly statusClick = output<void>();
  /** “…” clicked. Emits the event so you can anchor a `p-menu`: `(menu)="menu.toggle($event)"`. */
  readonly menu = output<MouseEvent>();

  protected readonly statusLabel = computed(() => (this.status() === 'resolved' ? 'Resolved' : 'Open'));
  protected readonly shown = computed(() => this.participants().slice(0, this.maxAvatars()));
  protected readonly hidden = computed(() => Math.max(0, this.participants().length - this.maxAvatars()));
  protected readonly participantLabel = computed(() => 'Participants: ' + this.participants().map((p) => p.name).join(', '));
  protected readonly isDate = computed(() => this.date() instanceof Date || typeof this.date() === 'number');
  protected readonly isoDate = computed(() => (this.isDate() ? new Date(this.date() as Date | number).toISOString().slice(0, 10) : null));

  protected initials(p: SpecParticipant): string {
    return p.initials ?? p.name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  }

  protected colorFor(name: string): string {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }
}
