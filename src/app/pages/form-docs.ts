import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { SelectButton } from 'primeng/selectbutton';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { Slider } from 'primeng/slider';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DocPage } from '../docs/doc-page';
import { ComponentDoc, formatTag } from '../docs/types';

const FIG = (n: string) => `❖ ${n}`;
const SIZES = [null, 'small', 'large'];
const MATERIALS = [
  { name: 'Timber', code: 'TIM' },
  { name: 'Steel', code: 'STL' },
  { name: 'Concrete', code: 'CON' },
  { name: 'Masonry', code: 'MAS' },
  { name: 'Aluminium', code: 'ALU' },
];

/* ───────── Button ───────── */
export const buttonDoc: ComponentDoc = {
  id: 'button',
  title: 'Button',
  description: 'Triggers an action. Use one primary button per view for the main action; pair it with secondary, outlined or text buttons for the rest.',
  figma: FIG('Button'),
  importCode: `import { Button } from 'primeng/button';`,
  tag: 'p-button',
  args: [
    { name: 'onClick', description: 'Emits when the button is clicked.', type: '(event: MouseEvent) => void', control: 'none', event: true },
    { name: 'label', description: 'Button text.', type: 'string', default: 'Calculate', control: 'text', required: true },
    { name: 'severity', description: 'Colour role.', type: "'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'", default: null, control: 'select', options: [null, 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'] },
    { name: 'variant', description: 'Outlined or text style.', type: "'outlined' | 'text'", default: null, control: 'radio', options: [null, 'outlined', 'text'] },
    { name: 'size', description: 'Button size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'icon', description: 'PrimeIcons class, e.g. pi pi-check.', type: 'string', default: '', control: 'text' },
    { name: 'iconPos', description: 'Icon position.', type: "'left' | 'right' | 'top' | 'bottom'", default: 'left', control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    { name: 'rounded', description: 'Pill shape.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'raised', description: 'Adds a shadow.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'loading', description: 'Shows a spinner and disables the button.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'disabled', description: 'Disables the button.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'badge', description: 'Badge value shown inside the button.', type: 'string', default: '', control: 'text' },
  ],
  stories: [
    { name: 'Primary', args: {} },
    { name: 'Secondary', args: { severity: 'secondary', label: 'Save draft' } },
    { name: 'Outlined', args: { variant: 'outlined', label: 'Export PDF', icon: 'pi pi-download' } },
    { name: 'Text', args: { variant: 'text', label: 'Cancel', severity: 'secondary' } },
    { name: 'Danger', args: { severity: 'danger', label: 'Delete project', icon: 'pi pi-trash' } },
    { name: 'Large', args: { size: 'large' } },
    { name: 'Small', args: { size: 'small' } },
    { name: 'Loading', args: { loading: true, label: 'Calculating' } },
    { name: 'Icon only', description: 'Always give icon-only buttons an aria-label.', args: { label: '', icon: 'pi pi-cog', rounded: true, variant: 'text', severity: 'secondary' } },
  ],
};

@Component({
  selector: 'pg-button',
  imports: [DocPage, Button],
  template: `
    <ds-doc-page [doc]="doc" group="Button">
      <ng-template #preview let-a>
        <p-button [label]="a.label" [severity]="a.severity" [variant]="a.variant" [size]="a.size" [icon]="a.icon || undefined" [iconPos]="a.iconPos"
          [rounded]="a.rounded" [raised]="a.raised" [loading]="a.loading" [disabled]="a.disabled" [badge]="a.badge || undefined" [ariaLabel]="a.label || 'Settings'" />
      </ng-template>
    </ds-doc-page>`,
})
export class ButtonPage { doc = buttonDoc; }

/* ───────── InputText ───────── */
export const inputTextDoc: ComponentDoc = {
  id: 'input-text',
  title: 'InputText',
  description: 'Single-line text field. Pair with FloatLabel or IftaLabel for labels, and IconField for leading or trailing icons.',
  figma: FIG('InputText'),
  importCode: `import { InputText } from 'primeng/inputtext';`,
  code: (a) => {
    const attrs = ['pInputText', 'id="project"', `placeholder="${a['placeholder']}"`, '[(ngModel)]="value"'];
    if (a['pSize']) attrs.push(`pSize="${a['pSize']}"`);
    if (a['variant'] === 'filled') attrs.push('variant="filled"');
    if (a['invalid']) attrs.push('[invalid]="true"');
    if (a['disabled']) attrs.push('disabled');
    if (a['fluid']) attrs.push('fluid');
    const input = formatTag('input', attrs);
    if (a['floatLabel']) return `<p-floatlabel variant="on">\n  ${input.split('\n').join('\n  ')}\n  <label for="project">${a['placeholder']}</label>\n</p-floatlabel>`;
    return input;
  },
  args: [
    { name: 'placeholder', description: 'Placeholder / label text.', type: 'string', default: 'Project name', control: 'text' },
    { name: 'pSize', description: 'Field size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'variant', description: 'Outlined or filled background.', type: "'outlined' | 'filled'", default: 'outlined', control: 'radio', options: ['outlined', 'filled'] },
    { name: 'floatLabel', description: 'Wrap in p-floatlabel (variant “on”).', type: 'boolean', default: false, control: 'boolean' },
    { name: 'invalid', description: 'Invalid state.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'fluid', description: 'Full width.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Float label', args: { floatLabel: true } },
    { name: 'Filled', args: { variant: 'filled' } },
    { name: 'Invalid', args: { invalid: true } },
    { name: 'Disabled', args: { disabled: true } },
  ],
};

@Component({
  selector: 'pg-input-text',
  imports: [DocPage, InputText, FloatLabel, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <div [style.width.px]="a.fluid ? 360 : null">
          @if (a.floatLabel) {
            <p-floatlabel variant="on">
              <input pInputText id="it-float" [pSize]="a.pSize" [variant]="a.variant" [invalid]="a.invalid" [disabled]="a.disabled" [fluid]="a.fluid" [(ngModel)]="v" />
              <label for="it-float">{{ a.placeholder }}</label>
            </p-floatlabel>
          } @else {
            <input pInputText [placeholder]="a.placeholder" [attr.aria-label]="a.placeholder" [pSize]="a.pSize" [variant]="a.variant" [invalid]="a.invalid" [disabled]="a.disabled" [fluid]="a.fluid" [(ngModel)]="v" />
          }
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class InputTextPage { doc = inputTextDoc; v = ''; }

/* ───────── Select ───────── */
export const selectDoc: ComponentDoc = {
  id: 'select',
  title: 'Select',
  description: 'Choose one option from a list. Turn on filter for lists longer than about 10 items.',
  figma: FIG('Select'),
  importCode: `import { Select } from 'primeng/select';`,
  tag: 'p-select',
  code: (a) => {
    const attrs = ['[options]="materials"', '[(ngModel)]="material"', 'optionLabel="name"', `placeholder="${a['placeholder']}"`];
    for (const k of ['filter', 'showClear', 'checkmark', 'disabled', 'invalid']) if (a[k]) attrs.push(k);
    if (a['size']) attrs.push(`size="${a['size']}"`);
    return formatTag('p-select', attrs);
  },
  args: [
    { name: 'placeholder', description: 'Text shown when empty.', type: 'string', default: 'Select a material', control: 'text' },
    { name: 'size', description: 'Field size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'filter', description: 'Show a filter input in the panel.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'showClear', description: 'Show a clear icon.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'checkmark', description: 'Show a checkmark on the selected item.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'invalid', description: 'Invalid state.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Filter and clear', args: { filter: true, showClear: true, checkmark: true } },
    { name: 'Invalid', args: { invalid: true } },
  ],
};

@Component({
  selector: 'pg-select',
  imports: [DocPage, Select, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <p-select [options]="materials" [(ngModel)]="v" optionLabel="name" [placeholder]="a.placeholder" [size]="a.size" [filter]="a.filter"
          [showClear]="a.showClear" [checkmark]="a.checkmark" [invalid]="a.invalid" [disabled]="a.disabled" [style]="{ width: '240px' }" appendTo="body" [ariaLabel]="a.placeholder" />
      </ng-template>
    </ds-doc-page>`,
})
export class SelectPage { doc = selectDoc; materials = MATERIALS; v = null; }

/* ───────── MultiSelect ───────── */
export const multiSelectDoc: ComponentDoc = {
  id: 'multi-select',
  title: 'MultiSelect',
  description: 'Choose several options from a list. Use display="chip" when users need to see every selection.',
  figma: FIG('MultiSelect'),
  importCode: `import { MultiSelect } from 'primeng/multiselect';`,
  code: (a) => {
    const attrs = ['[options]="materials"', '[(ngModel)]="selected"', 'optionLabel="name"', `placeholder="${a['placeholder']}"`];
    if (a['display'] === 'chip') attrs.push('display="chip"');
    if (a['filter']) attrs.push('filter');
    if (a['maxSelectedLabels'] !== 3) attrs.push(`[maxSelectedLabels]="${a['maxSelectedLabels']}"`);
    if (a['disabled']) attrs.push('disabled');
    return formatTag('p-multiselect', attrs);
  },
  args: [
    { name: 'placeholder', description: 'Text shown when empty.', type: 'string', default: 'Select materials', control: 'text' },
    { name: 'display', description: 'How selections are shown.', type: "'comma' | 'chip'", default: 'comma', control: 'radio', options: ['comma', 'chip'] },
    { name: 'filter', description: 'Show a filter input.', type: 'boolean', default: true, control: 'boolean' },
    { name: 'maxSelectedLabels', description: 'Labels shown before summarising as “n items selected”.', type: 'number', default: 3, control: 'number' },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Chips', args: { display: 'chip' } },
  ],
};

@Component({
  selector: 'pg-multiselect',
  imports: [DocPage, MultiSelect, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <p-multiselect [options]="materials" [(ngModel)]="v" optionLabel="name" [placeholder]="a.placeholder" [display]="a.display" [filter]="a.filter"
          [maxSelectedLabels]="a.maxSelectedLabels" [disabled]="a.disabled" [style]="{ width: '280px' }" appendTo="body" [ariaLabel]="a.placeholder" />
      </ng-template>
    </ds-doc-page>`,
})
export class MultiSelectPage { doc = multiSelectDoc; materials = MATERIALS; v = [MATERIALS[0], MATERIALS[1]]; }

/* ───────── Checkbox ───────── */
export const checkboxDoc: ComponentDoc = {
  id: 'checkbox',
  title: 'Checkbox',
  description: 'Select one or more independent options. Always pair with a clickable label.',
  figma: FIG('Checkbox'),
  importCode: `import { Checkbox } from 'primeng/checkbox';`,
  code: (a) => {
    const attrs = ['inputId="wind"', '[(ngModel)]="checked"', '[binary]="true"'];
    if (a['size']) attrs.push(`size="${a['size']}"`);
    if (a['variant'] === 'filled') attrs.push('variant="filled"');
    if (a['indeterminate']) attrs.push('[indeterminate]="true"');
    if (a['invalid']) attrs.push('[invalid]="true"');
    if (a['disabled']) attrs.push('[disabled]="true"');
    return `${formatTag('p-checkbox', attrs)}\n<label for="wind">${a['label']}</label>`;
  },
  args: [
    { name: 'label', description: 'Label text.', type: 'string', default: 'Include wind load', control: 'text' },
    { name: 'checked', description: 'Checked state (binary).', type: 'boolean', default: true, control: 'boolean', noCode: true },
    { name: 'size', description: 'Size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'variant', description: 'Outlined or filled.', type: "'outlined' | 'filled'", default: 'outlined', control: 'radio', options: ['outlined', 'filled'] },
    { name: 'indeterminate', description: 'Partially selected state.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'invalid', description: 'Invalid state.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Checked', args: {} },
    { name: 'Unchecked', args: { checked: false } },
    { name: 'Indeterminate', args: { indeterminate: true, checked: false, label: 'Select all members' } },
    { name: 'Disabled', args: { disabled: true } },
  ],
};

@Component({
  selector: 'pg-checkbox',
  imports: [DocPage, Checkbox, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <div class="inline-field">
          <p-checkbox [inputId]="'cb-' + a.label" [ngModel]="a.checked" [binary]="true" [size]="a.size" [variant]="a.variant" [indeterminate]="a.indeterminate" [invalid]="a.invalid" [disabled]="a.disabled" />
          <label [for]="'cb-' + a.label">{{ a.label }}</label>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class CheckboxPage { doc = checkboxDoc; }

/* ───────── RadioButton ───────── */
export const radioDoc: ComponentDoc = {
  id: 'radio-button',
  title: 'RadioButton',
  description: 'Select exactly one option from a short list (2–5). Use Select for longer lists.',
  figma: FIG('RadioButton'),
  importCode: `import { RadioButton } from 'primeng/radiobutton';`,
  code: (a) => {
    const extra = [a['size'] ? `size="${a['size']}"` : '', a['disabled'] ? '[disabled]="true"' : ''].filter(Boolean).join(' ');
    return `@for (r of regions; track r) {\n  <div class="field">\n    <p-radiobutton name="region" [value]="r" [(ngModel)]="region" [inputId]="r"${extra ? ' ' + extra : ''} />\n    <label [for]="r">{{ r }}</label>\n  </div>\n}`;
  },
  args: [
    { name: 'value', description: 'Selected value.', type: 'string', default: 'Region B', control: 'radio', options: ['Region A', 'Region B', 'Region C'], noCode: true },
    { name: 'size', description: 'Size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Group', args: {} }, { name: 'Large', args: { size: 'large' } }],
};

@Component({
  selector: 'pg-radio',
  imports: [DocPage, RadioButton, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <div class="stack-row">
          @for (r of regions; track r) {
            <div class="inline-field">
              <p-radiobutton [name]="'reg-' + a.size + a.value" [value]="r" [ngModel]="a.value" [inputId]="'rb-' + r + a.size" [size]="a.size" [disabled]="a.disabled" />
              <label [for]="'rb-' + r + a.size">{{ r }}</label>
            </div>
          }
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class RadioPage { doc = radioDoc; regions = ['Region A', 'Region B', 'Region C']; }

/* ───────── ToggleSwitch ───────── */
export const toggleDoc: ComponentDoc = {
  id: 'toggle-switch',
  title: 'ToggleSwitch',
  description: 'Turns a setting on or off with immediate effect. Use Checkbox when the change only applies after submitting a form.',
  figma: FIG('ToggleSwitch'),
  importCode: `import { ToggleSwitch } from 'primeng/toggleswitch';`,
  code: (a) => `${formatTag('p-toggleswitch', ['inputId="auto"', '[(ngModel)]="enabled"', ...(a['disabled'] ? ['[disabled]="true"'] : [])])}\n<label for="auto">${a['label']}</label>`,
  args: [
    { name: 'label', description: 'Label text.', type: 'string', default: 'Auto-adjust parameters', control: 'text' },
    { name: 'checked', description: 'On / off.', type: 'boolean', default: true, control: 'boolean', noCode: true },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'On', args: {} }, { name: 'Off', args: { checked: false } }, { name: 'Disabled', args: { disabled: true } }],
};

@Component({
  selector: 'pg-toggle',
  imports: [DocPage, ToggleSwitch, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <div class="inline-field">
          <p-toggleswitch [inputId]="'ts-' + a.checked + a.disabled" [ngModel]="a.checked" [disabled]="a.disabled" />
          <label [for]="'ts-' + a.checked + a.disabled">{{ a.label }}</label>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class TogglePage { doc = toggleDoc; }

/* ───────── SelectButton ───────── */
export const selectButtonDoc: ComponentDoc = {
  id: 'select-button',
  title: 'SelectButton',
  description: 'A row of toggle buttons for choosing one (or several) options. For view switching, prefer the SPEC Segmented Control.',
  figma: FIG('SelectButton'),
  importCode: `import { SelectButton } from 'primeng/selectbutton';`,
  code: (a) => formatTag('p-selectbutton', ['[options]="units"', '[(ngModel)]="unit"', ...(a['multiple'] ? ['[multiple]="true"'] : []), ...(a['size'] ? [`size="${a['size']}"`] : []), ...(a['disabled'] ? ['[disabled]="true"'] : [])]),
  args: [
    { name: 'multiple', description: 'Allow several selections.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'size', description: 'Size.', type: "'small' | 'large'", default: null, control: 'radio', options: SIZES },
    { name: 'disabled', description: 'Disabled state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Single', args: {} }, { name: 'Small', args: { size: 'small' } }],
};

@Component({
  selector: 'pg-selectbutton',
  imports: [DocPage, SelectButton, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <p-selectbutton [options]="units" [(ngModel)]="v" [multiple]="a.multiple" [size]="a.size" [disabled]="a.disabled" ariaLabelledBy="units" />
      </ng-template>
    </ds-doc-page>`,
})
export class SelectButtonPage { doc = selectButtonDoc; units = ['Metric', 'Imperial']; v: unknown = 'Metric'; }

/* ───────── InputNumber ───────── */
export const inputNumberDoc: ComponentDoc = {
  id: 'input-number',
  title: 'InputNumber',
  description: 'Numeric input with locale formatting, min / max limits, prefixes and suffixes. For calculator parameters with units, use the SPEC Calculator Input.',
  figma: FIG('InputNumber'),
  importCode: `import { InputNumber } from 'primeng/inputnumber';`,
  code: (a) => {
    const attrs = ['inputId="load"', '[(ngModel)]="load"', `mode="${a['mode']}"`];
    if (a['mode'] === 'currency') attrs.push('currency="AUD"', 'locale="en-AU"');
    if (a['suffix']) attrs.push(`suffix="${a['suffix']}"`);
    if (a['showButtons']) attrs.push('[showButtons]="true"');
    attrs.push(`[min]="${a['min']}"`, `[max]="${a['max']}"`);
    return formatTag('p-inputnumber', attrs);
  },
  args: [
    { name: 'mode', description: 'Formatting mode.', type: "'decimal' | 'currency'", default: 'decimal', control: 'radio', options: ['decimal', 'currency'] },
    { name: 'suffix', description: 'Text after the value.', type: 'string', default: ' kN', control: 'text' },
    { name: 'showButtons', description: 'Show spinner buttons.', type: 'boolean', default: true, control: 'boolean' },
    { name: 'min', description: 'Minimum value.', type: 'number', default: 0, control: 'number' },
    { name: 'max', description: 'Maximum value.', type: 'number', default: 500, control: 'number' },
  ],
  stories: [{ name: 'Load with suffix', args: {} }, { name: 'Currency', args: { mode: 'currency', suffix: '', showButtons: false, max: 100000 } }],
};

@Component({
  selector: 'pg-inputnumber',
  imports: [DocPage, InputNumber, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        @if (a.mode === 'currency') {
          <p-inputnumber [(ngModel)]="price" mode="currency" currency="AUD" locale="en-AU" [showButtons]="a.showButtons" [min]="a.min" [max]="a.max" ariaLabel="Price" />
        } @else {
          <p-inputnumber [(ngModel)]="v" mode="decimal" [suffix]="a.suffix" [showButtons]="a.showButtons" [min]="a.min" [max]="a.max" ariaLabel="Load" />
        }
      </ng-template>
    </ds-doc-page>`,
})
export class InputNumberPage { doc = inputNumberDoc; v = 120; price = 1450; }

/* ───────── DatePicker ───────── */
export const datePickerDoc: ComponentDoc = {
  id: 'date-picker',
  title: 'DatePicker',
  description: 'Pick a date or a range. Set inline to embed the calendar in a panel.',
  figma: FIG('DatePicker'),
  importCode: `import { DatePicker } from 'primeng/datepicker';`,
  canvasHeight: 140,
  code: (a) => formatTag('p-datepicker', ['[(ngModel)]="date"', `selectionMode="${a['selectionMode']}"`, `dateFormat="${a['dateFormat']}"`, ...(a['showIcon'] ? ['showIcon'] : []), ...(a['inline'] ? ['inline'] : [])]),
  args: [
    { name: 'selectionMode', description: 'Single date or range.', type: "'single' | 'range'", default: 'single', control: 'radio', options: ['single', 'range'] },
    { name: 'dateFormat', description: 'Display format.', type: 'string', default: 'dd.mm.y', control: 'text' },
    { name: 'showIcon', description: 'Show a calendar button.', type: 'boolean', default: true, control: 'boolean' },
    { name: 'inline', description: 'Render the calendar inline.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Default', args: {} }, { name: 'Inline range', args: { inline: true, selectionMode: 'range' } }],
};

@Component({
  selector: 'pg-datepicker',
  imports: [DocPage, DatePicker, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <p-datepicker [ngModel]="a.selectionMode === 'range' ? range : date" [selectionMode]="a.selectionMode" [dateFormat]="a.dateFormat" [showIcon]="a.showIcon" [inline]="a.inline" appendTo="body" ariaLabel="Date" />
      </ng-template>
    </ds-doc-page>`,
})
export class DatePickerPage { doc = datePickerDoc; date = new Date(2026, 3, 15); range = [new Date(2026, 3, 15), new Date(2026, 3, 22)]; }

/* ───────── Textarea ───────── */
export const textareaDoc: ComponentDoc = {
  id: 'textarea',
  title: 'Textarea',
  description: 'Multi-line text such as notes, discussion replies and project descriptions.',
  figma: FIG('Textarea'),
  importCode: `import { Textarea } from 'primeng/textarea';`,
  code: (a) => formatTag('textarea', ['pTextarea', '[(ngModel)]="notes"', `rows="${a['rows']}"`, `placeholder="${a['placeholder']}"`, ...(a['autoResize'] ? ['[autoResize]="true"'] : []), ...(a['invalid'] ? ['[invalid]="true"'] : [])], false),
  args: [
    { name: 'placeholder', description: 'Placeholder text.', type: 'string', default: 'Add a note for the reviewer', control: 'text' },
    { name: 'rows', description: 'Visible rows.', type: 'number', default: 4, control: 'number' },
    { name: 'autoResize', description: 'Grow with content.', type: 'boolean', default: true, control: 'boolean' },
    { name: 'invalid', description: 'Invalid state.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Default', args: {} }],
};

@Component({
  selector: 'pg-textarea',
  imports: [DocPage, Textarea, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <textarea pTextarea [(ngModel)]="v" [rows]="a.rows" [placeholder]="a.placeholder" [autoResize]="a.autoResize" [invalid]="a.invalid" style="width: 340px; max-width: 100%" [attr.aria-label]="a.placeholder"></textarea>
      </ng-template>
    </ds-doc-page>`,
})
export class TextareaPage { doc = textareaDoc; v = ''; }

/* ───────── Slider ───────── */
export const sliderDoc: ComponentDoc = {
  id: 'slider',
  title: 'Slider',
  description: 'Pick a value from a continuous range, such as a safety factor or a tolerance. Show the current value next to the slider.',
  figma: FIG('Slider'),
  importCode: `import { Slider } from 'primeng/slider';`,
  code: (a) => formatTag('p-slider', ['[(ngModel)]="value"', `[min]="${a['min']}"`, `[max]="${a['max']}"`, `[step]="${a['step']}"`, ...(a['range'] ? ['[range]="true"'] : [])]),
  args: [
    { name: 'min', description: 'Minimum.', type: 'number', default: 0, control: 'number' },
    { name: 'max', description: 'Maximum.', type: 'number', default: 100, control: 'number' },
    { name: 'step', description: 'Step.', type: 'number', default: 1, control: 'number' },
    { name: 'range', description: 'Two handles.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Single', args: {} }, { name: 'Range', args: { range: true } }],
};

@Component({
  selector: 'pg-slider',
  imports: [DocPage, Slider, FormsModule],
  template: `
    <ds-doc-page [doc]="doc">
      <ng-template #preview let-a>
        <div class="slider-demo">
          @if (a.range) {
            <p-slider [(ngModel)]="r" [range]="true" [min]="a.min" [max]="a.max" [step]="a.step" ariaLabel="Range" />
            <span class="num">{{ r[0] }} – {{ r[1] }}</span>
          } @else {
            <p-slider [(ngModel)]="v" [min]="a.min" [max]="a.max" [step]="a.step" ariaLabel="Value" />
            <span class="num">{{ v }}</span>
          }
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class SliderPage { doc = sliderDoc; v = 40; r = [20, 70]; }

/* ───────── IconField (search) — used by Introduction examples ───────── */
@Component({
  selector: 'ds-search-field',
  imports: [IconField, InputIcon, InputText, FormsModule],
  template: `<p-iconfield><p-inputicon class="pi pi-search" /><input pInputText placeholder="Search projects" aria-label="Search projects" [(ngModel)]="q" /></p-iconfield>`,
})
export class SearchField { q = ''; }
