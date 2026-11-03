import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  SpecAppHeader, SpecCalcInput, SpecCheckSummary, SpecDiscussionCard, SpecLogo, SpecNavSection, SpecParticipant,
  SpecSegmentedControl, SpecSideNav, SpecStatusBadge, SpecSummaryRow,
} from '@spec/ui';
import { DocPage } from '../docs/doc-page';
import { ComponentDoc, formatTag } from '../docs/types';

const G = 'SPEC Components';
const FIG = '❖ Custom Components';
const imp = (...names: string[]) => `import { ${names.join(', ')} } from '@spec/ui';`;
const q = (s: unknown) => String(s).replace(/"/g, '&quot;');

/* ─────────────────────────── Calculator Input ─────────────────────────── */
export const calcInputDoc: ComponentDoc = {
  id: 'calculator-input',
  title: 'Calculator Input',
  selector: 'spec-calc-input',
  description: 'Numeric input for calculator parameters. The label floats onto the border once a value exists, the unit sits inside the field and the info button explains the parameter. Bound to a form control, it switches to the warning state by itself when the control is invalid and touched.',
  figma: FIG + ' → input-calculator',
  importCode: imp('SpecCalcInput'),
  models: ['value'],
  code: (a) => {
    const attrs = [`label="${q(a['label'])}"`];
    if (a['unit']) attrs.push(`unit="${q(a['unit'])}"`);
    attrs.push('[(value)]="span"');
    if (a['state'] !== 'default') attrs.push(`state="${a['state']}"`);
    if (a['info']) attrs.push(`info="${q(a['info'])}"`);
    if (a['warning']) attrs.push(`warning="${q(a['warning'])}"`);
    if (a['min'] !== null && a['min'] !== undefined) attrs.push(`[min]="${a['min']}"`);
    if (a['max'] !== null && a['max'] !== undefined) attrs.push(`[max]="${a['max']}"`);
    if (a['type'] === 'text') attrs.push('type="text"');
    return formatTag('spec-calc-input', attrs);
  },
  args: [
    { name: 'label', description: 'Parameter name. Placeholder when empty, then floats onto the border.', type: 'string', default: 'Span length', control: 'text', required: true },
    { name: 'unit', description: 'Unit of measure shown in brackets. Empty hides it.', type: 'string', default: 'mm', control: 'text' },
    { name: 'value', description: 'Current value. Number for type="number", string for type="text". Use [(value)], ngModel or formControl.', type: 'number | string | null', default: null, control: 'number', noCode: true },
    { name: 'state', description: 'Visual state (Figma “State”). Forms can also disable it or trigger warning.', type: "'default' | 'readonly' | 'disabled' | 'warning'", default: 'default', control: 'radio', options: ['default', 'readonly', 'disabled', 'warning'] },
    { name: 'info', description: 'Tooltip for the info button; also read by screen readers. Empty hides the button.', type: 'string', default: 'Clear span between supports.', control: 'text' },
    { name: 'warning', description: 'Message under the field in the warning state.', type: 'string', default: '', control: 'text' },
    { name: 'type', description: 'Native input type.', type: "'number' | 'text'", default: 'number', control: 'radio', options: ['number', 'text'] },
    { name: 'min', description: 'Native min (number type).', type: 'number', default: null, control: 'number' },
    { name: 'max', description: 'Native max (number type).', type: 'number', default: null, control: 'number' },
    { name: 'disabled', description: 'Disable the field. Same as state="disabled" or control.disable().', type: 'boolean', default: false, control: 'none' },
    { name: 'inputId', description: 'Id of the native input. Auto-generated when omitted.', type: 'string', default: 'spec-calc-n', control: 'none' },
  ],
  events: [
    { name: 'valueChange', description: 'Value changed by typing (part of [(value)]).', type: 'number | string | null' },
    { name: 'infoClick', description: 'Info button clicked. The tooltip also shows on hover and focus.', type: 'void' },
    { name: 'blurred', description: 'Field lost focus, after the form control is marked touched.', type: 'void' },
  ],
  types: [{ name: 'Types', code: `type SpecCalcInputState = 'default' | 'readonly' | 'disabled' | 'warning';\ntype SpecCalcInputValue = number | string | null;` }],
  usage: [
    {
      title: 'Reactive form with validation',
      description: 'Validators drive the warning state; no extra binding needed. The field turns red after the user leaves it with an invalid value.',
      files: [
        { label: 'beam-form.component.ts', lang: 'ts', code: `import { Component } from '@angular/core';\nimport { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { SpecCalcInput } from '@spec/ui';\n\n@Component({\n  selector: 'app-beam-form',\n  imports: [ReactiveFormsModule, SpecCalcInput],\n  templateUrl: './beam-form.component.html',\n})\nexport class BeamFormComponent {\n  form = new FormGroup({\n    span: new FormControl<number | null>(4800, [Validators.required, Validators.max(12000)]),\n    depth: new FormControl<number | null>(null, [Validators.required, Validators.min(90), Validators.max(600)]),\n  });\n}` },
        { label: 'beam-form.component.html', lang: 'html', code: `<form [formGroup]="form" class="grid">\n  <spec-calc-input label="Span length" unit="mm" formControlName="span"\n    info="Clear span between supports." warning="Maximum span is 12 000 mm." />\n  <spec-calc-input label="Member depth" unit="mm" formControlName="depth"\n    [min]="90" [max]="600" warning="Depth must be between 90 and 600 mm." />\n</form>` },
      ],
    },
    {
      title: 'Signals with [(value)]',
      files: [{ label: 'template', lang: 'html', code: `<!-- span = signal<number | null>(4800) -->\n<spec-calc-input label="Span length" unit="mm" [(value)]="span" />\n<p>Span: {{ span() }} mm</p>` }],
    },
  ],
  a11y: [
    'The visible label is a real <label for> linked to the input, so clicking it focuses the field.',
    'The unit and warning message are attached with aria-describedby; the warning is announced with role="alert".',
    'Warning sets aria-invalid="true". The info button has an accessible name (“About <label>”) and its text is exposed to screen readers, not only in the tooltip.',
    'inputmode="decimal" opens the numeric keypad on phones.',
  ],
  stories: [
    { name: 'Placeholder', args: { value: null } },
    { name: 'Filled', args: { value: 4800 } },
    { name: 'Read-only', description: 'Derived values the user cannot edit.', args: { value: 4800, state: 'readonly' } },
    { name: 'Disabled', args: { value: 4800, state: 'disabled' } },
    { name: 'Warning', args: { value: 12500, state: 'warning', warning: 'Maximum span is 12 000 mm.' } },
    { name: 'Other input', description: 'Free text without unit or info (Figma “Other Input”).', args: { label: 'Project reference', unit: '', info: '', type: 'text', value: null } },
  ],
};

@Component({
  selector: 'pg-calc-input',
  imports: [DocPage, SpecCalcInput, ReactiveFormsModule, JsonPipe],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div style="width: 280px"><spec-calc-input [label]="a.label" [unit]="a.unit" [value]="a.value" [state]="a.state" [info]="a.info" [warning]="a.warning" [type]="a.type" [min]="a.min" [max]="a.max" /></div>
      </ng-template>
      <section class="story" id="calculator-input-live-form">
        <h2>Live reactive form</h2>
        <p class="story-desc">Type a span above 12 000 or a depth outside 90–600, then leave the field.</p>
        <div class="canvas"><div class="canvas-stage start" style="min-height: 0">
          <form [formGroup]="form" class="live-form">
            <spec-calc-input label="Span length" unit="mm" formControlName="span" info="Clear span between supports." warning="Maximum span is 12 000 mm." />
            <spec-calc-input label="Member depth" unit="mm" formControlName="depth" [min]="90" [max]="600" warning="Depth must be between 90 and 600 mm." />
            <code class="form-state">{{ form.value | json }} · {{ form.valid ? 'valid' : 'invalid' }}</code>
          </form>
        </div></div>
      </section>
    </ds-doc-page>`,
})
export class CalcInputPage {
  doc = calcInputDoc;
  form = new FormGroup({
    span: new FormControl<number | null>(4800, [Validators.required, Validators.max(12000)]),
    depth: new FormControl<number | null>(null, [Validators.required, Validators.min(90), Validators.max(600)]),
  });
}

/* ─────────────────────────── Check Summary ─────────────────────────── */
const ROWS: SpecSummaryRow[] = [{ label: 'Timber Member', value: 65.6 }, { label: 'Steel Plate', value: 0.65 }];

export const checkSummaryDoc: ComponentDoc = {
  id: 'check-summary',
  title: 'Check Summary',
  selector: 'spec-check-summary',
  description: 'Result card for a design check (geometry, thickness, capacity). Shows PASS / FAIL with the utilisation ratio, an explanation, a “Fix This” action powered by SPEC Intelligence and expandable member values.',
  figma: FIG + ' → summary-box',
  importCode: imp('SpecCheckSummary', 'SpecSummaryRow'),
  models: ['expanded'],
  canvasHeight: 200,
  code: (a) => {
    const attrs = [`title="${q(a['title'])}"`, `status="${a['status']}"`, `[ratio]="${a['ratio']}"`];
    if (a['status'] === 'fail' && a['message']) attrs.push(`message="${q(a['message'])}"`);
    if (!a['fixable']) attrs.push('[fixable]="false"');
    if (a['fixing']) attrs.push('[fixing]="fixing()"');
    attrs.push('[rows]="rows"', '[(expanded)]="showValues"', '(fix)="autoAdjust()"');
    return formatTag('spec-check-summary', attrs);
  },
  args: [
    { name: 'title', description: 'Check name.', type: 'string', default: 'Geometry Check', control: 'text', required: true },
    { name: 'status', description: 'Result.', type: "'pass' | 'fail'", default: 'fail', control: 'radio', options: ['pass', 'fail'] },
    { name: 'ratio', description: 'Utilisation ratio. A number is formatted as percent (140.3 → “140.3%”).', type: 'number | string | null', default: 140.3, control: 'number' },
    { name: 'message', description: 'Explanation shown when failing.', type: 'string', default: 'Ratio exceeds 100%, auto-adjust parameters to resolve.', control: 'text' },
    { name: 'fixable', description: 'Show “Fix This” when failing.', type: 'boolean', default: true, control: 'boolean' },
    { name: 'fixCount', description: 'Credits the fix costs (“+n”). 0 hides it.', type: 'number', default: 1, control: 'number', noCode: true },
    { name: 'fixing', description: 'Spinner on the fix button while your handler runs.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'rows', description: 'Member values. Numbers above 100 render red unless status is set.', type: 'SpecSummaryRow[]', default: undefined, control: 'none' },
    { name: 'expanded', description: 'Whether member values are visible.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'passLabel / failLabel / fixLabel', description: 'Override labels, e.g. for translation.', type: 'string', default: undefined, control: 'none' },
  ],
  events: [
    { name: 'fix', description: '“Fix This” clicked. Set [fixing] while you run the adjustment.', type: 'void' },
    { name: 'expandedChange', description: 'Summary values shown or hidden (part of [(expanded)]).', type: 'boolean' },
  ],
  types: [{ name: 'SpecSummaryRow', code: `interface SpecSummaryRow {\n  label: string;\n  /** Number = percent (one decimal + %), string = shown as-is. */\n  value: number | string;\n  /** Defaults to 'fail' when value > 100. */\n  status?: 'pass' | 'fail';\n}` }],
  usage: [{
    title: 'Running a fix',
    description: 'Show progress on the button while the request runs, then pass the new result in.',
    files: [
      { label: 'geometry-check.component.ts', lang: 'ts', code: `export class GeometryCheckComponent {\n  private calc = inject(CalculationService);\n  result = this.calc.geometry;          // signal<CheckResult>\n  fixing = signal(false);\n  showValues = signal(false);\n\n  async autoAdjust() {\n    this.fixing.set(true);\n    try { await this.calc.autoAdjust('geometry'); }\n    finally { this.fixing.set(false); }\n  }\n}` },
      { label: 'geometry-check.component.html', lang: 'html', code: `<spec-check-summary title="Geometry Check"\n  [status]="result().ratio > 100 ? 'fail' : 'pass'"\n  [ratio]="result().ratio" [message]="result().message"\n  [rows]="result().members" [(expanded)]="showValues"\n  [fixing]="fixing()" (fix)="autoAdjust()" />` },
    ],
  }],
  a11y: [
    'The card is a <section> labelled by its title (a real <h3>); change the heading level by wrapping if your page needs it.',
    'The result area has role="status", so a change from FAIL to PASS is announced.',
    'The toggle uses aria-expanded and aria-controls pointing to the values list.',
  ],
  stories: [
    { name: 'Fail', args: {} },
    { name: 'Fail expanded', args: { expanded: true } },
    { name: 'Fixing', args: { fixing: true } },
    { name: 'Pass', args: { status: 'pass', ratio: 65.6, title: 'Thickness Check' } },
  ],
};

@Component({
  selector: 'pg-check-summary',
  imports: [DocPage, SpecCheckSummary],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div style="width: 380px; max-width: 100%"><spec-check-summary [title]="a.title" [status]="a.status" [ratio]="a.ratio" [message]="a.message" [fixable]="a.fixable" [fixCount]="a.fixCount" [fixing]="a.fixing" [rows]="rows" [expanded]="a.expanded" /></div>
      </ng-template>
    </ds-doc-page>`,
})
export class CheckSummaryPage { doc = checkSummaryDoc; rows = ROWS; }

/* ─────────────────────────── Segmented Control ─────────────────────────── */
function optionsFor(n: number) { return Array.from({ length: n ?? 2 }, (_, i) => `Option ${i + 1}`); }

export const segmentedDoc: ComponentDoc = {
  id: 'segmented-control',
  title: 'Segmented Control',
  selector: 'spec-segmented',
  description: 'Switches between 2–4 mutually exclusive views of the same content, such as Inputs / Outputs / Report or Metric / Imperial. Implements ControlValueAccessor, so it also works as a form field.',
  figma: FIG + ' → Segmented Control',
  importCode: imp('SpecSegmentedControl', 'SpecSegmentedOption'),
  models: ['value'],
  code: (a) => {
    const attrs = [`[options]="${JSON.stringify(optionsFor(a['count'] as number)).replace(/"/g, "'")}"`, '[(value)]="view"'];
    if (a['size'] === 'small') attrs.push('size="small"');
    if (a['fluid']) attrs.push('fluid');
    if (a['disabled']) attrs.push('disabled');
    attrs.push('ariaLabel="View"');
    return formatTag('spec-segmented', attrs);
  },
  args: [
    { name: 'options', description: 'Strings, or { label, value, icon?, disabled? } objects.', type: 'SpecSegmentedOptions<T>', default: undefined, control: 'none', required: true },
    { name: 'count', description: 'Demo only: number of options (Figma “Options”).', type: '2 | 3 | 4', default: 2, control: 'radio', options: [2, 3, 4], noCode: true },
    { name: 'selected', description: 'Demo only: selected option (Figma “Selected”).', type: 'number', default: 1, control: 'radio', options: [1, 2, 3, 4], noCode: true },
    { name: 'value', description: 'Selected value. Use [(value)], ngModel or formControl.', type: 'T | null', default: null, control: 'none' },
    { name: 'size', description: 'Size.', type: "'medium' | 'small'", default: 'medium', control: 'radio', options: ['medium', 'small'] },
    { name: 'fluid', description: 'Stretch to the parent width with equal options.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'disabled', description: 'Disable every option.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'ariaLabel', description: 'Accessible group label.', type: 'string', default: 'Options', control: 'none' },
  ],
  events: [
    { name: 'changed', description: 'User picked an option.', type: 'T' },
    { name: 'valueChange', description: 'Part of [(value)].', type: 'T | null' },
  ],
  types: [{ name: 'SpecSegmentedOption', code: `interface SpecSegmentedOption<T = unknown> {\n  label: string;\n  value: T;\n  icon?: string;      // e.g. 'pi pi-table'\n  disabled?: boolean;\n}\ntype SpecSegmentedOptions<T> = readonly (string | SpecSegmentedOption<T>)[];` }],
  usage: [
    {
      title: 'Typed options in a reactive form',
      files: [
        { label: 'units.component.ts', lang: 'ts', code: `type UnitSystem = 'si' | 'us';\n\nexport class UnitsComponent {\n  units: SpecSegmentedOption<UnitSystem>[] = [\n    { label: 'Metric', value: 'si' },\n    { label: 'Imperial', value: 'us' },\n  ];\n  unit = new FormControl<UnitSystem>('si', { nonNullable: true });\n}` },
        { label: 'units.component.html', lang: 'html', code: `<spec-segmented [options]="units" [formControl]="unit" ariaLabel="Unit system" />` },
      ],
    },
    {
      title: 'Switching views with signals',
      files: [{ label: 'template', lang: 'html', code: `<!-- view = signal('Inputs') -->\n<spec-segmented [options]="['Inputs', 'Outputs', 'Report']" [(value)]="view" ariaLabel="Calculator view" />\n\n@switch (view()) {\n  @case ('Inputs') { <app-inputs /> }\n  @case ('Outputs') { <app-outputs /> }\n  @case ('Report') { <app-report /> }\n}` }],
    },
  ],
  a11y: [
    'Rendered as role="radiogroup" with role="radio" buttons and aria-checked.',
    'Roving tabindex: Tab enters the group once; ←/→ or ↑/↓ move the selection, Home/End jump to the ends. Disabled options are skipped.',
    'Always pass ariaLabel (or label the group visibly) so the group has a name.',
  ],
  stories: [
    { name: 'Two options', args: { count: 2, selected: 1 } },
    { name: 'Three options', args: { count: 3, selected: 2 } },
    { name: 'Four options', args: { count: 4, selected: 4 } },
    { name: 'Small', args: { count: 3, size: 'small' } },
    { name: 'Fluid', description: 'Fills the container; useful in panels and drawers.', args: { count: 3, fluid: true } },
  ],
};

@Component({
  selector: 'pg-segmented',
  imports: [DocPage, SpecSegmentedControl],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div [style.width]="a.fluid ? '360px' : 'auto'">
          <spec-segmented [options]="opts(a.count)" [value]="opts(a.count)[Math.min(a.selected, a.count) - 1]" [size]="a.size" [fluid]="a.fluid" [disabled]="a.disabled" ariaLabel="Demo options" />
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class SegmentedPage { doc = segmentedDoc; Math = Math; opts = optionsFor; }

/* ─────────────────────────── Discussion Card ─────────────────────────── */
const PEOPLE: SpecParticipant[] = [{ name: 'William MacDonald' }, { name: 'Adam Jones' }, { name: 'Siti Rahma' }, { name: 'Ken Lee' }, { name: 'Maya Putri' }];

export const discussionDoc: ComponentDoc = {
  id: 'discussion-card',
  title: 'Discussion Card',
  selector: 'spec-discussion-card',
  description: 'Summary of a project discussion thread: question, date, status, thread type, the latest message and participants. Used in project sidebars and the community feed.',
  figma: FIG + ' → Discussion Box',
  importCode: imp('SpecDiscussionCard', 'SpecParticipant'),
  alignStart: true,
  code: (a) => formatTag('spec-discussion-card', [
    `title="${q(a['title'])}"`, '[date]="thread.createdAt"', `status="${a['status']}"`, `thread="${q(a['thread'])}"`,
    `author="${q(a['author'])}"`, '[excerpt]="thread.lastMessage"', `[replies]="${a['replies']}"`, '[participants]="thread.people"',
    ...(a['maxAvatars'] !== 3 ? [`[maxAvatars]="${a['maxAvatars']}"`] : []), ...(a['compact'] ? ['compact'] : []),
    '(opened)="open(thread)"', '(menu)="threadMenu.toggle($event)"',
  ]),
  args: [
    { name: 'title', description: 'Thread question.', type: 'string', default: 'Wind region type?', control: 'text', required: true },
    { name: 'date', description: 'Date, timestamp or pre-formatted string.', type: 'Date | number | string | null', default: undefined, control: 'none' },
    { name: 'dateFormat', description: 'Angular DatePipe format for Date values.', type: 'string', default: 'dd.MM.yy', control: 'none' },
    { name: 'status', description: 'Thread status.', type: "'resolved' | 'open'", default: 'resolved', control: 'radio', options: ['resolved', 'open'] },
    { name: 'thread', description: 'Thread category.', type: 'string', default: 'General Thread', control: 'text' },
    { name: 'author', description: 'Author of the latest message.', type: 'string', default: 'William MacDonald', control: 'text' },
    { name: 'excerpt', description: 'Latest message, truncated to one line.', type: 'string', default: undefined, control: 'none' },
    { name: 'replies', description: 'Reply count.', type: 'number', default: 4, control: 'number' },
    { name: 'participants', description: 'People in the thread. Initials and colours are derived from names.', type: 'SpecParticipant[]', default: undefined, control: 'none' },
    { name: 'maxAvatars', description: 'Avatars before “+n”.', type: 'number', default: 3, control: 'number' },
    { name: 'compact', description: 'Small variant (max 460px).', type: 'boolean', default: false, control: 'boolean' },
  ],
  events: [
    { name: 'opened', description: 'Title clicked: open the thread.', type: 'void' },
    { name: 'statusClick', description: 'Status badge clicked: show a status menu.', type: 'void' },
    { name: 'menu', description: '“…” clicked. Pass the event to p-menu.toggle($event).', type: 'MouseEvent' },
  ],
  types: [{ name: 'SpecParticipant', code: `interface SpecParticipant {\n  name: string;\n  initials?: string; // default: first letters of the first two words\n  color?: string;    // default: derived from name\n  image?: string;\n}` }],
  usage: [{
    title: 'Thread list with an action menu',
    files: [
      { label: 'threads.component.html', lang: 'html', code: `<p-menu #threadMenu [model]="threadActions" [popup]="true" appendTo="body" />\n\n@for (t of threads(); track t.id) {\n  <spec-discussion-card [title]="t.title" [date]="t.createdAt"\n    [status]="t.resolved ? 'resolved' : 'open'" [thread]="t.category"\n    [author]="t.lastAuthor" [excerpt]="t.lastMessage" [replies]="t.replyCount"\n    [participants]="t.people" (opened)="open(t)"\n    (menu)="selected = t; threadMenu.toggle($event)" />\n}` },
      { label: 'threads.component.ts', lang: 'ts', code: `import { Menu } from 'primeng/menu';\nimport { MenuItem } from 'primeng/api';\nimport { SpecDiscussionCard } from '@spec/ui';\n\nthreadActions: MenuItem[] = [\n  { label: 'Mark as resolved', icon: 'pi pi-check', command: () => this.resolve(this.selected) },\n  { label: 'Copy link', icon: 'pi pi-link', command: () => this.copyLink(this.selected) },\n];` },
    ],
  }],
  a11y: [
    'The title is a button inside an <h3>, so the thread opens with Enter/Space and headings stay navigable.',
    'The date is a <time datetime> element; avatars carry the participant name as a title and the group has an aria-label listing everyone.',
    '“…” has aria-label="Thread actions" and aria-haspopup="menu".',
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Small', args: { compact: true } },
    { name: 'Open thread', args: { status: 'open', title: 'Connection detail for steel plate?', thread: 'Engineering', replies: 1 } },
    { name: 'Many participants', args: { maxAvatars: 2 } },
  ],
};

@Component({
  selector: 'pg-discussion',
  imports: [DocPage, SpecDiscussionCard],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div style="width: 100%"><spec-discussion-card [title]="a.title" [date]="date" [status]="a.status" [thread]="a.thread" [author]="a.author" [excerpt]="excerpt" [replies]="a.replies" [participants]="people" [maxAvatars]="a.maxAvatars" [compact]="a.compact" /></div>
      </ng-template>
    </ds-doc-page>`,
})
export class DiscussionPage {
  doc = discussionDoc;
  date = new Date(2026, 3, 15);
  people = PEOPLE;
  excerpt = 'I’m a bit unsure of the correct wind region for this building because the site sits on the boundary between two regions.';
}

/* ─────────────────────────── Status Badge ─────────────────────────── */
export const statusBadgeDoc: ComponentDoc = {
  id: 'status-badge',
  title: 'Status Badge',
  selector: 'spec-status-badge',
  description: 'Outlined pill for short statuses such as Resolved, Failed or Pending. Use Tag for filled labels and Badge for counts.',
  figma: FIG + ' → Default Badge',
  importCode: imp('SpecStatusBadge'),
  tag: 'spec-status-badge',
  args: [
    { name: 'value', description: 'Badge text. When empty, projected content is shown.', type: 'string', default: 'Badge', control: 'text', required: true },
    { name: 'severity', description: 'Colour role.', type: "'success' | 'error' | 'warning' | 'neutral'", default: 'success', control: 'radio', options: ['success', 'error', 'warning', 'neutral'] },
    { name: 'dot', description: 'Leading status dot.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'chevron', description: 'Trailing chevron when the badge opens a menu.', type: 'boolean', default: false, control: 'boolean' },
  ],
  usage: [{ title: 'Mapping API status', files: [{ label: 'template', lang: 'html', code: `<spec-status-badge [severity]="severityOf(calc.status)" [value]="calc.status | titlecase" dot />` }, { label: 'component.ts', lang: 'ts', code: `severityOf(s: 'passed' | 'failed' | 'pending'): SpecStatusSeverity {\n  return ({ passed: 'success', failed: 'error', pending: 'warning' } as const)[s];\n}` }] }],
  a11y: ['Colour is never the only signal: the text names the status. The dot and chevron are aria-hidden.', 'When the badge opens a menu, wrap it in a <button> with an aria-label (Discussion Card does this).'],
  stories: [
    { name: 'Success', args: { value: 'Passed' } },
    { name: 'Error', args: { severity: 'error', value: 'Failed' } },
    { name: 'Warning', args: { severity: 'warning', value: 'Pending' } },
    { name: 'With dot and chevron', args: { value: 'Resolved', dot: true, chevron: true } },
  ],
};

@Component({
  selector: 'pg-status-badge',
  imports: [DocPage, SpecStatusBadge],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a><spec-status-badge [value]="a.value" [severity]="a.severity" [dot]="a.dot" [chevron]="a.chevron" /></ng-template>
    </ds-doc-page>`,
})
export class StatusBadgePage { doc = statusBadgeDoc; }

/* ─────────────────────────── App Header ─────────────────────────── */
export const headerDoc: ComponentDoc = {
  id: 'app-header',
  title: 'App Header',
  selector: 'spec-app-header',
  description: 'Top bar of the SPEC Toolbox app: project breadcrumb, upgrade call to action for free plans, SPEC Intelligence credits and the account menu. Extra controls go in the specHeaderActions slot.',
  figma: FIG + ' → Header',
  importCode: imp('SpecAppHeader', 'SpecBreadcrumbItem'),
  alignStart: true,
  code: (a) => {
    const attrs = [`[breadcrumb]="['${String(a['crumb1'])}', '${String(a['crumb2'])}']"`, `user="${q(a['user'])}"`, `[credits]="${a['credits']}"`];
    if (!a['showUpgrade']) attrs.push('[showUpgrade]="false"');
    if (a['showLogo']) attrs.push('showLogo');
    attrs.push('(upgrade)="goToBilling()"', '(settings)="openSettings()"');
    return formatTag('spec-app-header', attrs);
  },
  args: [
    { name: 'breadcrumb', description: 'Trail; the last item is the current page. Strings or { label, url? }.', type: '(string | SpecBreadcrumbItem)[]', default: undefined, control: 'none' },
    { name: 'crumb1', description: 'Demo: parent breadcrumb.', type: 'string', default: 'My Project', control: 'text', noCode: true },
    { name: 'crumb2', description: 'Demo: current page.', type: 'string', default: 'Timber Office', control: 'text', noCode: true },
    { name: 'user', description: 'Signed-in user name.', type: 'string', default: 'Adam Jones', control: 'text' },
    { name: 'credits', description: 'SPEC Intelligence credits. null hides the pill.', type: 'number | null', default: 12, control: 'number' },
    { name: 'showUpgrade', description: 'Show “Upgrade Account” (free plans).', type: 'boolean', default: true, control: 'boolean' },
    { name: 'upgradeLabel', description: 'Upgrade button text.', type: 'string', default: 'Upgrade Account', control: 'none' },
    { name: 'showLogo', description: 'Show the logo when the side bar is collapsed.', type: 'boolean', default: false, control: 'boolean' },
  ],
  events: [
    { name: 'breadcrumbClick', description: 'A non-link breadcrumb was clicked.', type: '{ item: SpecBreadcrumbItem; index: number }' },
    { name: 'upgrade', description: '“Upgrade Account” clicked.', type: 'void' },
    { name: 'creditsClick', description: 'Credits pill clicked.', type: 'void' },
    { name: 'settings', description: 'Gear clicked.', type: 'void' },
  ],
  usage: [{
    title: 'In the app shell with router breadcrumbs',
    files: [
      { label: 'shell.component.html', lang: 'html', code: `<spec-app-header\n  [breadcrumb]="[{ label: project().name, url: '/projects/' + project().id }, calc().name]"\n  [user]="auth.user().name" [credits]="billing.credits()"\n  [showUpgrade]="auth.user().plan === 'basic'"\n  (upgrade)="router.navigate(['/billing'])" (settings)="settingsMenu.toggle($event)">\n  <p-button specHeaderActions icon="pi pi-bell" [text]="true" [rounded]="true"\n    severity="contrast" ariaLabel="Notifications" />\n</spec-app-header>` },
    ],
  }],
  a11y: [
    'Breadcrumb is a <nav aria-label="Breadcrumb"> with an ordered list; the current page has aria-current="page".',
    'Icon-only controls (credits, settings) have accessible names. Focus rings are white on the green bar.',
    'On screens narrower than 720px the user name and upgrade button hide; keep critical actions elsewhere too.',
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Pro member', args: { showUpgrade: false, credits: 240 } },
    { name: 'With logo', args: { showLogo: true } },
  ],
};

@Component({
  selector: 'pg-header',
  imports: [DocPage, SpecAppHeader],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div style="width: 100%; border-radius: 6px; overflow: hidden"><spec-app-header [breadcrumb]="[a.crumb1, a.crumb2]" [user]="a.user" [credits]="a.credits" [showUpgrade]="a.showUpgrade" [showLogo]="a.showLogo" /></div>
      </ng-template>
    </ds-doc-page>`,
})
export class HeaderPage { doc = headerDoc; }

/* ─────────────────────────── Side Bar ─────────────────────────── */
function navFor(type: string, drafts: number, projects: number): SpecNavSection[] {
  const items = [
    { id: 'new', label: 'New Calculator', icon: 'pi pi-calculator' },
    { id: 'drafts', label: 'Draft', icon: 'pi pi-file', badge: drafts },
    { id: 'projects', label: 'My Projects', icon: 'pi pi-folder', badge: projects },
  ];
  if (type === 'Company') items.push({ id: 'team', label: 'Team Members', icon: 'pi pi-users', badge: 0 });
  if (type === 'Suppliers') items.push({ id: 'library', label: 'Product Library', icon: 'pi pi-box', badge: 0 });
  return [{ label: 'Projects', items }];
}
const ACCOUNT: SpecNavSection[] = [{ label: 'Account', items: [{ id: 'community', label: 'Community', icon: 'pi pi-users' }, { id: 'profile', label: 'My Profile', icon: 'pi pi-user' }] }];

export const sideNavDoc: ComponentDoc = {
  id: 'side-bar',
  title: 'Side Bar',
  selector: 'spec-side-nav',
  description: 'Primary app navigation. Fully data-driven: pass sections for the main area and footerSections for Account. Content changes with workspace type (Personal, Company, Suppliers) and member level.',
  figma: FIG + ' → Side Bar',
  importCode: imp('SpecSideNav', 'SpecNavSection', 'SpecWorkspace'),
  models: ['activeId'],
  canvasHeight: 560,
  code: (a) => formatTag('spec-side-nav', [
    `[workspace]="{ name: '${a['type'] === 'Personal' ? 'Personal Project' : a['type'] === 'Company' ? 'Timber Co.' : 'Supplier Hub'}', type: '${a['type']}', level: '${a['level']}' }"`,
    '[sections]="nav"', '[footerSections]="account"', '[(activeId)]="current"', '(itemSelect)="go($event)"', '(workspaceClick)="workspaceMenu.toggle($event)"',
  ]),
  args: [
    { name: 'workspace', description: 'Workspace switcher content.', type: 'SpecWorkspace | null', default: undefined, control: 'none' },
    { name: 'type', description: 'Demo: workspace type (Figma “Type”).', type: "'Personal' | 'Company' | 'Suppliers'", default: 'Personal', control: 'radio', options: ['Personal', 'Company', 'Suppliers'], noCode: true },
    { name: 'level', description: 'Demo: member level (Figma “Member lvl”).', type: 'string', default: 'Pro', control: 'select', options: ['Basic', 'Pro', 'Team', 'Enterprise', 'Advanced', 'Premium'], noCode: true },
    { name: 'sections', description: 'Main navigation sections.', type: 'SpecNavSection[]', default: undefined, control: 'none', required: true },
    { name: 'footerSections', description: 'Sections pinned to the bottom.', type: 'SpecNavSection[]', default: undefined, control: 'none' },
    { name: 'activeId', description: 'Id of the current item.', type: 'string | null', default: 'new', control: 'none' },
    { name: 'showMenuButton', description: 'Show the burger button.', type: 'boolean', default: true, control: 'boolean' },
  ],
  events: [
    { name: 'itemSelect', description: 'Item clicked (after activeId updates).', type: 'SpecNavItem' },
    { name: 'activeIdChange', description: 'Part of [(activeId)].', type: 'string | null' },
    { name: 'workspaceClick', description: 'Workspace switcher clicked; anchor a p-menu or p-popover with the event.', type: 'MouseEvent' },
    { name: 'menuToggle', description: 'Burger clicked.', type: 'void' },
  ],
  types: [{ name: 'Navigation model', code: `interface SpecNavItem {\n  id: string;\n  label: string;\n  icon?: string;           // 'pi pi-folder'\n  badge?: number | string; // 0 hides it\n  url?: string;            // renders an <a href>\n  disabled?: boolean;\n}\ninterface SpecNavSection { label: string; items: readonly SpecNavItem[]; }\ninterface SpecWorkspace { name: string; type: 'Personal' | 'Company' | 'Suppliers' | 'Root'; level?: string; }` }],
  usage: [{
    title: 'Driving it from the router',
    description: 'Keep the active item in sync with the URL, and build sections from the member level.',
    files: [
      { label: 'shell.component.ts', lang: 'ts', code: `export class ShellComponent {\n  private router = inject(Router);\n  private url = toSignal(this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)), { initialValue: this.router.url });\n\n  current = computed(() => this.url().split('/')[1] || 'new');\n  nav = computed<SpecNavSection[]>(() => [{\n    label: 'Projects',\n    items: [\n      { id: 'new', label: 'New Calculator', icon: 'pi pi-calculator' },\n      { id: 'drafts', label: 'Draft', icon: 'pi pi-file', badge: this.store.draftCount() },\n      { id: 'projects', label: 'My Projects', icon: 'pi pi-folder', badge: this.store.projectCount() },\n    ],\n  }]);\n\n  go(item: SpecNavItem) { this.router.navigate(['/', item.id]); }\n}` },
      { label: 'shell.component.html', lang: 'html', code: `<spec-side-nav [workspace]="workspace()" [sections]="nav()" [footerSections]="account"\n  [activeId]="current()" (itemSelect)="go($event)" (workspaceClick)="wsMenu.toggle($event)" />` },
    ],
  }],
  a11y: [
    'Rendered as <aside> with <nav> landmarks; the active item has aria-current="page".',
    'Items with url render as links (middle-click and open-in-new-tab work); others are buttons.',
    'Width is controlled by the CSS variable --spec-side-nav-width (default 264px).',
  ],
  stories: [
    { name: 'Personal · Pro', args: {} },
    { name: 'Company · Team', args: { type: 'Company', level: 'Team' } },
    { name: 'Suppliers · Premium', args: { type: 'Suppliers', level: 'Premium' } },
  ],
};

@Component({
  selector: 'pg-side-nav',
  imports: [DocPage, SpecSideNav],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div style="height: 520px; border: 1px solid var(--ds-line); border-radius: 6px; overflow: hidden">
          <spec-side-nav [workspace]="{ name: a.type === 'Personal' ? 'Personal Project' : a.type === 'Company' ? 'Timber Co.' : 'Supplier Hub', type: a.type, level: a.level }"
            [sections]="nav(a.type)" [footerSections]="account" [(activeId)]="active" [showMenuButton]="a.showMenuButton" />
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class SideNavPage {
  doc = sideNavDoc;
  account = ACCOUNT;
  active = signal<string | null>('new');
  private cache = new Map<string, SpecNavSection[]>();
  nav(type: string) {
    if (!this.cache.has(type)) this.cache.set(type, navFor(type, type === 'Suppliers' ? 0 : 2, type === 'Company' ? 34 : 8));
    return this.cache.get(type)!;
  }
}

/* ─────────────────────────── Logo ─────────────────────────── */
export const logoDoc: ComponentDoc = {
  id: 'logo',
  title: 'Logo',
  selector: 'spec-logo',
  description: 'SPEC Toolbox wordmark from the Figma “MAIN LOGO” component. Use white on the brand-green bar and dark surfaces.',
  figma: FIG + ' → MAIN LOGO',
  importCode: imp('SpecLogo'),
  tag: 'spec-logo',
  args: [
    { name: 'variant', description: 'Colour variant.', type: "'color' | 'white'", default: 'color', control: 'radio', options: ['color', 'white'] },
    { name: 'height', description: 'Height in px; width keeps the 196 × 22 ratio.', type: 'number', default: 22, control: 'number' },
    { name: 'alt', description: 'Accessible name. Pass "" next to visible product text.', type: 'string', default: 'SPEC Toolbox', control: 'text' },
  ],
  a11y: ['The image has alt="SPEC Toolbox" by default.', 'The current asset is a 1× PNG export; replace logo-data.ts with the SVG from Figma for sharp rendering on retina screens.'],
  stories: [{ name: 'Colour', args: {} }, { name: 'White on brand', args: { variant: 'white' } }],
};

@Component({
  selector: 'pg-logo',
  imports: [DocPage, SpecLogo],
  template: `
    <ds-doc-page [doc]="doc" group="${G}">
      <ng-template #preview let-a>
        <div [style.background]="a.variant === 'white' ? 'var(--spec-brand)' : 'transparent'" style="padding: 16px 20px; border-radius: 6px">
          <spec-logo [variant]="a.variant" [height]="a.height" [alt]="a.alt" />
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class LogoPage { doc = logoDoc; }
