import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { Card } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TabsModule } from 'primeng/tabs';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Badge } from 'primeng/badge';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Chip } from 'primeng/chip';
import { ProgressBar } from 'primeng/progressbar';
import { Skeleton } from 'primeng/skeleton';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DocPage } from '../docs/doc-page';
import { ComponentDoc, formatTag } from '../docs/types';

const FIG = (n: string) => `❖ ${n}`;
const SEV = [null, 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'];

const PROJECTS = [
  { name: 'Timber Office', type: 'Timber beam', ratio: 65.6, status: 'Passed', updated: '15.04.26' },
  { name: 'Riverside Warehouse', type: 'Steel portal frame', ratio: 102.4, status: 'Failed', updated: '12.04.26' },
  { name: 'Northgate Carpark', type: 'Concrete slab', ratio: 88.1, status: 'Passed', updated: '09.04.26' },
  { name: 'Hillview Residence', type: 'Timber joist', ratio: 0, status: 'Draft', updated: '02.04.26' },
  { name: 'Harbour Pavilion', type: 'Steel connection', ratio: 97.3, status: 'Passed', updated: '28.03.26' },
  { name: 'Eastside School', type: 'Masonry wall', ratio: 114.8, status: 'Failed', updated: '21.03.26' },
];

/* ───────── DataTable ───────── */
export const tableDoc: ComponentDoc = {
  id: 'data-table',
  title: 'DataTable',
  description: 'Lists records such as projects and calculations. Supports sorting, selection, striping and pagination. Right-align numeric columns and use tabular figures.',
  figma: FIG('DataTable'),
  importCode: `import { TableModule } from 'primeng/table';`,
  alignStart: true,
  canvasHeight: 260,
  code: (a) => {
    const attrs = ['[value]="projects"'];
    if (a['size']) attrs.push(`size="${a['size']}"`);
    if (a['stripedRows']) attrs.push('stripedRows');
    if (a['showGridlines']) attrs.push('showGridlines');
    if (a['paginator']) attrs.push('[paginator]="true"', `[rows]="${a['rows']}"`);
    return formatTag('p-table', attrs, false, `<ng-template #header>
  <tr>
    <th pSortableColumn="name">Project <p-sortIcon field="name" /></th>
    <th>Type</th>
    <th pSortableColumn="ratio" class="num">Ratio <p-sortIcon field="ratio" /></th>
    <th>Status</th>
  </tr>
</ng-template>
<ng-template #body let-p>
  <tr>
    <td>{{ p.name }}</td><td>{{ p.type }}</td>
    <td class="num">{{ p.ratio }}%</td>
    <td><p-tag [value]="p.status" [severity]="sev(p.status)" /></td>
  </tr>
</ng-template>`);
  },
  args: [
    { name: 'size', description: 'Row density.', type: "'small' | 'large'", default: 'small', control: 'radio', options: SIZE_OPTS() },
    { name: 'stripedRows', description: 'Alternate row background.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'showGridlines', description: 'Cell borders.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'paginator', description: 'Show a paginator.', type: 'boolean', default: false, control: 'boolean' },
    { name: 'rows', description: 'Rows per page.', type: 'number', default: 4, control: 'number' },
  ],
  stories: [
    { name: 'Projects', args: {} },
    { name: 'Striped with paginator', args: { stripedRows: true, paginator: true } },
    { name: 'Gridlines', args: { showGridlines: true, size: null } },
  ],
};
function SIZE_OPTS() { return [null, 'small', 'large']; }

@Component({
  selector: 'pg-table',
  imports: [DocPage, TableModule, Tag],
  template: `
    <ds-doc-page [doc]="doc" group="Data">
      <ng-template #preview let-a>
        <div class="table-demo">
          <p-table [value]="projects" [size]="a.size" [stripedRows]="a.stripedRows" [showGridlines]="a.showGridlines" [paginator]="a.paginator" [rows]="a.rows || 4">
            <ng-template #header>
              <tr>
                <th pSortableColumn="name">Project <p-sortIcon field="name" /></th>
                <th>Type</th>
                <th pSortableColumn="ratio" class="num">Ratio <p-sortIcon field="ratio" /></th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </ng-template>
            <ng-template #body let-p>
              <tr>
                <td class="strong">{{ p.name }}</td>
                <td>{{ p.type }}</td>
                <td class="num">{{ p.ratio ? p.ratio.toFixed(1) + '%' : '–' }}</td>
                <td><p-tag [value]="p.status" [severity]="sev(p.status)" /></td>
                <td class="num">{{ p.updated }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class TablePage {
  doc = tableDoc;
  projects = PROJECTS;
  sev(s: string) { return s === 'Passed' ? 'success' : s === 'Failed' ? 'danger' : 'secondary'; }
}

/* ───────── Paginator ───────── */
export const paginatorDoc: ComponentDoc = {
  id: 'paginator',
  title: 'Paginator',
  description: 'Navigates paged data. Usually embedded in DataTable or DataView through the paginator input.',
  figma: FIG('Paginator'),
  importCode: `import { Paginator } from 'primeng/paginator';`,
  code: (a) => formatTag('p-paginator', ['(onPageChange)="onPage($event)"', '[first]="first"', `[rows]="${a['rows']}"`, `[totalRecords]="${a['totalRecords']}"`, ...(a['showRows'] ? ['[rowsPerPageOptions]="[10, 20, 50]"'] : [])]),
  args: [
    { name: 'totalRecords', description: 'Total number of records.', type: 'number', default: 120, control: 'number' },
    { name: 'rows', description: 'Rows per page.', type: 'number', default: 10, control: 'number' },
    { name: 'showRows', description: 'Show rows-per-page dropdown.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Default', args: {} }, { name: 'Rows per page', args: { showRows: true } }],
};

@Component({
  selector: 'pg-paginator',
  imports: [DocPage, Paginator],
  template: `
    <ds-doc-page [doc]="doc" group="Data">
      <ng-template #preview let-a>
        <p-paginator [first]="first" (onPageChange)="first = $event.first ?? 0" [rows]="a.rows" [totalRecords]="a.totalRecords" [rowsPerPageOptions]="a.showRows ? [10, 20, 50] : undefined" appendTo="body" />
      </ng-template>
    </ds-doc-page>`,
})
export class PaginatorPage { doc = paginatorDoc; first = 0; }

/* ───────── Card ───────── */
export const cardDoc: ComponentDoc = {
  id: 'card',
  title: 'Card',
  description: 'Groups related content and actions, such as a project overview or a calculator result.',
  figma: FIG('Card'),
  importCode: `import { Card } from 'primeng/card';`,
  code: (a) => formatTag('p-card', [`header="${a['header']}"`, `subheader="${a['subheader']}"`], false, `<p>${a['content']}</p>${a['footer'] ? '\n<ng-template #footer>\n  <p-button label="Open project" size="small" />\n</ng-template>' : ''}`),
  args: [
    { name: 'header', description: 'Title.', type: 'string', default: 'Timber Office', control: 'text' },
    { name: 'subheader', description: 'Subtitle.', type: 'string', default: 'Timber beam · 3 calculations', control: 'text' },
    { name: 'content', description: 'Body text.', type: 'string', default: 'Last calculated 15.04.26. Two checks pass and one needs attention.', control: 'text' },
    { name: 'footer', description: 'Show a footer with an action.', type: 'boolean', default: true, control: 'boolean' },
  ],
  stories: [{ name: 'Project card', args: {} }, { name: 'Without footer', args: { footer: false } }],
};

@Component({
  selector: 'pg-card',
  imports: [DocPage, Card, Button],
  template: `
    <ds-doc-page [doc]="doc" group="Panel">
      <ng-template #preview let-a>
        <p-card [header]="a.header" [subheader]="a.subheader" [style]="{ width: '340px', maxWidth: '100%' }">
          <p class="card-copy">{{ a.content }}</p>
          @if (a.footer) {
            <ng-template #footer><div class="row-gap"><p-button label="Open project" size="small" /><p-button label="Share" size="small" severity="secondary" variant="outlined" /></div></ng-template>
          }
        </p-card>
      </ng-template>
    </ds-doc-page>`,
})
export class CardPage { doc = cardDoc; }

/* ───────── Accordion ───────── */
export const accordionDoc: ComponentDoc = {
  id: 'accordion',
  title: 'Accordion',
  description: 'Stacked, collapsible sections. Use it to tuck away secondary parameters in long calculator forms.',
  figma: FIG('Accordion'),
  importCode: `import { AccordionModule } from 'primeng/accordion';`,
  alignStart: true,
  code: (a) => formatTag('p-accordion', [`value="0"`, ...(a['multiple'] ? ['[multiple]="true"'] : [])], false,
    `<p-accordion-panel value="0">\n  <p-accordion-header>Geometry</p-accordion-header>\n  <p-accordion-content>…</p-accordion-content>\n</p-accordion-panel>`),
  args: [{ name: 'multiple', description: 'Allow several open panels.', type: 'boolean', default: false, control: 'boolean' }],
  stories: [{ name: 'Default', args: {} }],
};

@Component({
  selector: 'pg-accordion',
  imports: [DocPage, AccordionModule],
  template: `
    <ds-doc-page [doc]="doc" group="Panel">
      <ng-template #preview let-a>
        <div style="width: 100%; max-width: 560px">
          <p-accordion value="0" [multiple]="a.multiple">
            @for (s of sections; track s.t; let i = $index) {
              <p-accordion-panel [value]="'' + i">
                <p-accordion-header>{{ s.t }}</p-accordion-header>
                <p-accordion-content><p class="card-copy">{{ s.c }}</p></p-accordion-content>
              </p-accordion-panel>
            }
          </p-accordion>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class AccordionPage {
  doc = accordionDoc;
  sections = [
    { t: 'Geometry', c: 'Span 4 800 mm, spacing 600 mm, member depth 240 mm.' },
    { t: 'Loads', c: 'Dead load 0.5 kPa, live load 1.5 kPa, wind region B.' },
    { t: 'Material', c: 'GL18 glulam, service class 1, load duration medium term.' },
  ];
}

/* ───────── Tabs ───────── */
export const tabsDoc: ComponentDoc = {
  id: 'tabs',
  title: 'Tabs',
  description: 'Switches between related panels of one page, such as Inputs, Outputs and Report on a calculator.',
  figma: FIG('Tabs'),
  importCode: `import { TabsModule } from 'primeng/tabs';`,
  alignStart: true,
  code: () => `<p-tabs value="0">\n  <p-tablist>\n    <p-tab value="0">Inputs</p-tab>\n    <p-tab value="1">Outputs</p-tab>\n    <p-tab value="2">Report</p-tab>\n  </p-tablist>\n  <p-tabpanels>\n    <p-tabpanel value="0">…</p-tabpanel>\n  </p-tabpanels>\n</p-tabs>`,
  args: [{ name: 'scrollable', description: 'Scroll buttons when tabs overflow.', type: 'boolean', default: false, control: 'boolean' }],
  stories: [{ name: 'Calculator tabs', args: {} }],
};

@Component({
  selector: 'pg-tabs',
  imports: [DocPage, TabsModule],
  template: `
    <ds-doc-page [doc]="doc" group="Panel">
      <ng-template #preview let-a>
        <div style="width: 100%; max-width: 560px">
          <p-tabs value="0" [scrollable]="a.scrollable">
            <p-tablist><p-tab value="0">Inputs</p-tab><p-tab value="1">Outputs</p-tab><p-tab value="2">Report</p-tab></p-tablist>
            <p-tabpanels>
              <p-tabpanel value="0"><p class="card-copy">Enter geometry, loads and material for the member.</p></p-tabpanel>
              <p-tabpanel value="1"><p class="card-copy">Bending 65.6% · Shear 41.2% · Deflection 88.0%.</p></p-tabpanel>
              <p-tabpanel value="2"><p class="card-copy">Export a PDF report with every assumption listed.</p></p-tabpanel>
            </p-tabpanels>
          </p-tabs>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class TabsPage { doc = tabsDoc; }

/* ───────── Dialog ───────── */
export const dialogDoc: ComponentDoc = {
  id: 'dialog',
  title: 'Dialog',
  description: 'Modal window for focused tasks such as renaming a project. Keep dialogs short; send long flows to a page.',
  figma: FIG('Dialog'),
  importCode: `import { Dialog } from 'primeng/dialog';`,
  code: (a) => formatTag('p-dialog', [`header="${a['header']}"`, '[(visible)]="visible"', '[modal]="true"', `[style]="{ width: '${a['width']}px' }"`, ...(a['dismissableMask'] ? ['[dismissableMask]="true"'] : [])], false, `<input pInputText [(ngModel)]="name" />\n<ng-template #footer>\n  <p-button label="Cancel" severity="secondary" variant="text" (click)="visible = false" />\n  <p-button label="Save" (click)="save()" />\n</ng-template>`),
  args: [
    { name: 'header', description: 'Dialog title.', type: 'string', default: 'Rename project', control: 'text' },
    { name: 'width', description: 'Width in px.', type: 'number', default: 420, control: 'number' },
    { name: 'dismissableMask', description: 'Close when the mask is clicked.', type: 'boolean', default: true, control: 'boolean' },
  ],
  stories: [{ name: 'Default', args: {} }],
};

@Component({
  selector: 'pg-dialog',
  imports: [DocPage, Dialog, Button, InputText, FormsModule],
  template: `
    <ds-doc-page [doc]="doc" group="Overlay">
      <ng-template #preview let-a>
        <p-button label="Open dialog" icon="pi pi-external-link" (onClick)="cfg = a; visible = true" />
      </ng-template>
    </ds-doc-page>
    <p-dialog [header]="cfg?.header" [(visible)]="visible" [modal]="true" [style]="{ width: (cfg?.width ?? 420) + 'px', maxWidth: '92vw' }" [dismissableMask]="cfg?.dismissableMask">
      <label for="dlg-name" class="field-label">Project name</label>
      <input pInputText id="dlg-name" fluid [(ngModel)]="name" />
      <ng-template #footer>
        <p-button label="Cancel" severity="secondary" variant="text" (onClick)="visible = false" />
        <p-button label="Save" (onClick)="visible = false" />
      </ng-template>
    </p-dialog>`,
})
export class DialogPage { doc = dialogDoc; visible = false; name = 'Timber Office'; cfg: any = null; }

/* ───────── Tooltip ───────── */
export const tooltipDoc: ComponentDoc = {
  id: 'tooltip',
  title: 'Tooltip',
  description: 'Short hint on hover or focus. Never put essential information only in a tooltip.',
  figma: FIG('Tooltip'),
  importCode: `import { Tooltip } from 'primeng/tooltip';`,
  code: (a) => formatTag('p-button', ['icon="pi pi-info-circle"', `pTooltip="${a['text']}"`, `tooltipPosition="${a['position']}"`, 'ariaLabel="More info"']),
  args: [
    { name: 'text', description: 'Tooltip text.', type: 'string', default: 'Clear span between supports', control: 'text' },
    { name: 'position', description: 'Placement.', type: "'top' | 'right' | 'bottom' | 'left'", default: 'top', control: 'radio', options: ['top', 'right', 'bottom', 'left'] },
  ],
  stories: [{ name: 'Top', args: {} }, { name: 'Right', args: { position: 'right' } }],
};

@Component({
  selector: 'pg-tooltip',
  imports: [DocPage, Tooltip, Button],
  template: `
    <ds-doc-page [doc]="doc" group="Overlay">
      <ng-template #preview let-a>
        <p-button icon="pi pi-info-circle" severity="secondary" variant="outlined" [pTooltip]="a.text" [tooltipPosition]="a.position" ariaLabel="More info" label="Hover me" />
      </ng-template>
    </ds-doc-page>`,
})
export class TooltipPage { doc = tooltipDoc; }

/* ───────── Toast ───────── */
export const toastDoc: ComponentDoc = {
  id: 'toast',
  title: 'Toast',
  description: 'Brief confirmation after an action, such as “Project saved”. Use Message for persistent, inline feedback.',
  figma: FIG('Toast'),
  importCode: `import { Toast } from 'primeng/toast';\nimport { MessageService } from 'primeng/api';`,
  code: (a) => `<p-toast />\n<p-button label="Save" (onClick)="show()" />\n\n// component.ts\nshow() {\n  this.messageService.add({ severity: '${a['severity']}', summary: '${a['summary']}', detail: '${a['detail']}', life: 3000 });\n}`,
  args: [
    { name: 'severity', description: 'Message type.', type: "'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'", default: 'success', control: 'select', options: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'] },
    { name: 'summary', description: 'Title.', type: 'string', default: 'Project saved', control: 'text' },
    { name: 'detail', description: 'Detail text.', type: 'string', default: 'Timber Office was saved to My Projects.', control: 'text' },
  ],
  stories: [{ name: 'Success', args: {} }, { name: 'Error', args: { severity: 'error', summary: 'Calculation failed', detail: 'Check the span length and try again.' } }],
};

@Component({
  selector: 'pg-toast',
  imports: [DocPage, Button],
  template: `
    <ds-doc-page [doc]="doc" group="Overlay">
      <ng-template #preview let-a>
        <p-button label="Show toast" (onClick)="show(a)" [severity]="a.severity === 'error' ? 'danger' : undefined" />
      </ng-template>
    </ds-doc-page>`,
})
export class ToastPage {
  doc = toastDoc;
  private ms = inject(MessageService);
  show(a: any) { this.ms.add({ severity: a.severity, summary: a.summary, detail: a.detail, life: 3000 }); }
}

/* ───────── Message ───────── */
export const messageDoc: ComponentDoc = {
  id: 'message',
  title: 'Message',
  description: 'Inline feedback that stays until resolved, such as a calculation warning above the results.',
  figma: FIG('Message'),
  importCode: `import { Message } from 'primeng/message';`,
  code: (a) => formatTag('p-message', [`severity="${a['severity']}"`, ...(a['variant'] ? [`variant="${a['variant']}"`] : []), ...(a['icon'] ? [`icon="${a['icon']}"`] : []), ...(a['closable'] ? ['[closable]="true"'] : [])], false, String(a['text'])),
  args: [
    { name: 'text', description: 'Message content.', type: 'string', default: 'Deflection is within 5% of the limit.', control: 'text' },
    { name: 'severity', description: 'Message type.', type: "'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'", default: 'warn', control: 'select', options: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'] },
    { name: 'variant', description: 'Outlined or simple.', type: "'outlined' | 'simple'", default: null, control: 'radio', options: [null, 'outlined', 'simple'] },
    { name: 'icon', description: 'Icon class.', type: 'string', default: 'pi pi-exclamation-triangle', control: 'text' },
    { name: 'closable', description: 'Show a close button.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Warning', args: {} },
    { name: 'Success', args: { severity: 'success', text: 'All checks passed.', icon: 'pi pi-check-circle' } },
    { name: 'Error outlined', args: { severity: 'error', variant: 'outlined', text: 'Ratio exceeds 100%.', icon: 'pi pi-times-circle' } },
  ],
};

@Component({
  selector: 'pg-message',
  imports: [DocPage, Message],
  template: `
    <ds-doc-page [doc]="doc" group="Messages">
      <ng-template #preview let-a>
        <p-message [severity]="a.severity" [variant]="a.variant" [icon]="a.icon" [closable]="a.closable">{{ a.text }}</p-message>
      </ng-template>
    </ds-doc-page>`,
})
export class MessagePage { doc = messageDoc; }

/* ───────── Tag ───────── */
export const tagDoc: ComponentDoc = {
  id: 'tag',
  title: 'Tag',
  description: 'Filled label for categories and statuses in tables and cards.',
  figma: FIG('Tag'),
  importCode: `import { Tag } from 'primeng/tag';`,
  tag: 'p-tag',
  args: [
    { name: 'value', description: 'Tag text.', type: 'string', default: 'Passed', control: 'text', required: true },
    { name: 'severity', description: 'Colour role.', type: "'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'", default: 'success', control: 'select', options: SEV },
    { name: 'icon', description: 'Icon class.', type: 'string', default: '', control: 'text' },
    { name: 'rounded', description: 'Pill shape.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Success', args: {} },
    { name: 'Danger', args: { severity: 'danger', value: 'Failed' } },
    { name: 'Secondary rounded', args: { severity: 'secondary', value: 'Draft', rounded: true } },
    { name: 'With icon', args: { severity: 'info', value: 'Pro', icon: 'pi pi-star' } },
  ],
};

@Component({
  selector: 'pg-tag',
  imports: [DocPage, Tag],
  template: `<ds-doc-page [doc]="doc" group="Misc"><ng-template #preview let-a><p-tag [value]="a.value" [severity]="a.severity" [icon]="a.icon || undefined" [rounded]="a.rounded" /></ng-template></ds-doc-page>`,
})
export class TagPage { doc = tagDoc; }

/* ───────── Badge ───────── */
export const badgeDoc: ComponentDoc = {
  id: 'badge',
  title: 'Badge',
  description: 'Small count or status indicator, alone or overlaid on an icon or avatar.',
  figma: FIG('Badge'),
  importCode: `import { Badge } from 'primeng/badge';\nimport { OverlayBadge } from 'primeng/overlaybadge';`,
  code: (a) => a['overlay']
    ? formatTag('p-overlaybadge', [`value="${a['value']}"`, ...(a['severity'] ? [`severity="${a['severity']}"`] : [])], false, '<i class="pi pi-bell" style="font-size: 1.5rem"></i>')
    : formatTag('p-badge', [`value="${a['value']}"`, ...(a['severity'] ? [`severity="${a['severity']}"`] : []), ...(a['size'] ? [`badgeSize="${a['size']}"`] : [])]),
  args: [
    { name: 'value', description: 'Badge value.', type: 'string | number', default: '8', control: 'text' },
    { name: 'severity', description: 'Colour role.', type: "'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'", default: null, control: 'select', options: SEV },
    { name: 'size', description: 'Size.', type: "'small' | 'large' | 'xlarge'", default: null, control: 'radio', options: [null, 'small', 'large', 'xlarge'] },
    { name: 'overlay', description: 'Overlay on an icon (OverlayBadge).', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [
    { name: 'Default', args: {} },
    { name: 'Secondary', description: 'Used for project counts in the side bar.', args: { severity: 'secondary', value: '2' } },
    { name: 'Overlay', args: { overlay: true, severity: 'danger', value: '3' } },
  ],
};

@Component({
  selector: 'pg-badge',
  imports: [DocPage, Badge, OverlayBadge],
  template: `
    <ds-doc-page [doc]="doc" group="Misc">
      <ng-template #preview let-a>
        @if (a.overlay) {
          <p-overlaybadge [value]="a.value" [severity]="a.severity"><i class="pi pi-bell" style="font-size: 1.5rem"></i></p-overlaybadge>
        } @else {
          <p-badge [value]="a.value" [severity]="a.severity" [badgeSize]="a.size" />
        }
      </ng-template>
    </ds-doc-page>`,
})
export class BadgePage { doc = badgeDoc; }

/* ───────── Avatar ───────── */
export const avatarDoc: ComponentDoc = {
  id: 'avatar',
  title: 'Avatar',
  description: 'Represents a person with initials, an icon or an image. Group avatars to show thread participants.',
  figma: FIG('Avatar'),
  importCode: `import { Avatar } from 'primeng/avatar';\nimport { AvatarGroup } from 'primeng/avatargroup';`,
  code: (a) => a['group']
    ? `<p-avatar-group>\n  <p-avatar label="WM" shape="circle" />\n  <p-avatar label="AJ" shape="circle" />\n  <p-avatar label="+3" shape="circle" />\n</p-avatar-group>`
    : formatTag('p-avatar', [a['icon'] ? `icon="${a['icon']}"` : `label="${a['label']}"`, `shape="${a['shape']}"`, ...(a['size'] ? [`size="${a['size']}"`] : [])]),
  args: [
    { name: 'label', description: 'Initials.', type: 'string', default: 'AJ', control: 'text' },
    { name: 'icon', description: 'Icon instead of initials.', type: 'string', default: '', control: 'text' },
    { name: 'shape', description: 'Shape.', type: "'square' | 'circle'", default: 'circle', control: 'radio', options: ['square', 'circle'] },
    { name: 'size', description: 'Size.', type: "'normal' | 'large' | 'xlarge'", default: null, control: 'radio', options: [null, 'large', 'xlarge'] },
    { name: 'group', description: 'Show as a group.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Initials', args: {} }, { name: 'Icon', args: { icon: 'pi pi-user', size: 'large' } }, { name: 'Group', args: { group: true } }],
};

@Component({
  selector: 'pg-avatar',
  imports: [DocPage, Avatar, AvatarGroup],
  template: `
    <ds-doc-page [doc]="doc" group="Misc">
      <ng-template #preview let-a>
        @if (a.group) {
          <p-avatar-group>
            <p-avatar label="WM" shape="circle" [style]="{ background: '#f59e0b', color: '#fff' }" />
            <p-avatar label="AJ" shape="circle" [style]="{ background: '#3b82f6', color: '#fff' }" />
            <p-avatar label="+3" shape="circle" />
          </p-avatar-group>
        } @else {
          <p-avatar [label]="a.icon ? undefined : a.label" [icon]="a.icon || undefined" [shape]="a.shape" [size]="a.size" />
        }
      </ng-template>
    </ds-doc-page>`,
})
export class AvatarPage { doc = avatarDoc; }

/* ───────── Chip ───────── */
export const chipDoc: ComponentDoc = {
  id: 'chip',
  title: 'Chip',
  description: 'Compact element for filters, selected values or tags a user can remove.',
  figma: FIG('Chip'),
  importCode: `import { Chip } from 'primeng/chip';`,
  tag: 'p-chip',
  args: [
    { name: 'label', description: 'Chip text.', type: 'string', default: 'Timber', control: 'text' },
    { name: 'icon', description: 'Icon class.', type: 'string', default: 'pi pi-box', control: 'text' },
    { name: 'removable', description: 'Show a remove icon.', type: 'boolean', default: false, control: 'boolean' },
  ],
  stories: [{ name: 'Default', args: {} }, { name: 'Removable', args: { removable: true, icon: '' } }],
};

@Component({
  selector: 'pg-chip',
  imports: [DocPage, Chip],
  template: `<ds-doc-page [doc]="doc" group="Misc"><ng-template #preview let-a><p-chip [label]="a.label" [icon]="a.icon || undefined" [removable]="a.removable" /></ng-template></ds-doc-page>`,
})
export class ChipPage { doc = chipDoc; }

/* ───────── ProgressBar ───────── */
export const progressDoc: ComponentDoc = {
  id: 'progress-bar',
  title: 'ProgressBar',
  description: 'Shows progress of a long task such as generating a report. Use indeterminate when the duration is unknown.',
  figma: FIG('ProgressBar'),
  importCode: `import { ProgressBar } from 'primeng/progressbar';`,
  code: (a) => formatTag('p-progressbar', [a['mode'] === 'indeterminate' ? 'mode="indeterminate"' : `[value]="${a['value']}"`, ...(a['showValue'] ? [] : ['[showValue]="false"'])]),
  args: [
    { name: 'value', description: 'Percent complete.', type: 'number', default: 64, control: 'number' },
    { name: 'mode', description: 'Mode.', type: "'determinate' | 'indeterminate'", default: 'determinate', control: 'radio', options: ['determinate', 'indeterminate'] },
    { name: 'showValue', description: 'Show the value label.', type: 'boolean', default: true, control: 'boolean' },
  ],
  stories: [{ name: 'Determinate', args: {} }, { name: 'Indeterminate', args: { mode: 'indeterminate' } }],
};

@Component({
  selector: 'pg-progress',
  imports: [DocPage, ProgressBar],
  template: `<ds-doc-page [doc]="doc" group="Misc"><ng-template #preview let-a><div style="width: 360px; max-width: 100%"><p-progressbar [value]="a.value" [mode]="a.mode" [showValue]="a.showValue" [style]="{ height: a.mode === 'indeterminate' ? '6px' : null }" /></div></ng-template></ds-doc-page>`,
})
export class ProgressPage { doc = progressDoc; }

/* ───────── Skeleton ───────── */
export const skeletonDoc: ComponentDoc = {
  id: 'skeleton',
  title: 'Skeleton',
  description: 'Placeholder that mirrors the layout while data loads.',
  figma: FIG('Skeleton'),
  importCode: `import { Skeleton } from 'primeng/skeleton';`,
  code: () => `<p-skeleton shape="circle" size="3rem" />\n<p-skeleton width="10rem" />\n<p-skeleton width="6rem" height=".75rem" />`,
  args: [{ name: 'animation', description: 'Wave animation.', type: "'wave' | 'none'", default: 'wave', control: 'radio', options: ['wave', 'none'] }],
  stories: [{ name: 'Card placeholder', args: {} }],
};

@Component({
  selector: 'pg-skeleton',
  imports: [DocPage, Skeleton],
  template: `
    <ds-doc-page [doc]="doc" group="Misc">
      <ng-template #preview let-a>
        <div class="skel">
          <p-skeleton shape="circle" size="3rem" [animation]="a.animation" />
          <div class="skel-lines"><p-skeleton width="12rem" [animation]="a.animation" /><p-skeleton width="8rem" height=".75rem" [animation]="a.animation" /></div>
        </div>
      </ng-template>
    </ds-doc-page>`,
})
export class SkeletonPage { doc = skeletonDoc; }
