import { Component, TemplateRef, computed, contentChild, effect, inject, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { RadioButton } from 'primeng/radiobutton';
import { Tooltip } from 'primeng/tooltip';
import { CodeBlock } from './code-block';
import { ArgDef, ComponentDoc, defaultArgs, genCode, storyId } from './types';
import { NavService } from '../nav.service';

type Bg = 'plain' | 'grid' | 'muted';

@Component({
  selector: 'ds-canvas',
  imports: [NgTemplateOutlet, CodeBlock, Tooltip],
  template: `
    <div class="canvas" [class.bg-grid]="bg() === 'grid'" [class.bg-muted]="bg() === 'muted'">
      @if (toolbar()) {
        <div class="canvas-bar">
          <button type="button" class="icon-btn" pTooltip="Zoom in" tooltipPosition="top" (click)="zoom.set(clamp(zoom() + 0.25))" aria-label="Zoom in"><i class="pi pi-search-plus"></i></button>
          <button type="button" class="icon-btn" pTooltip="Zoom out" tooltipPosition="top" (click)="zoom.set(clamp(zoom() - 0.25))" aria-label="Zoom out"><i class="pi pi-search-minus"></i></button>
          <button type="button" class="icon-btn" pTooltip="Reset zoom" tooltipPosition="top" (click)="zoom.set(1)" aria-label="Reset zoom"><i class="pi pi-refresh"></i></button>
          <span class="bar-sep"></span>
          <button type="button" class="icon-btn" [class.on]="bg() === 'grid'" pTooltip="Grid background" tooltipPosition="top" (click)="bg.set(bg() === 'grid' ? 'plain' : 'grid')" aria-label="Toggle grid"><i class="pi pi-th-large"></i></button>
          <button type="button" class="icon-btn" [class.on]="bg() === 'muted'" pTooltip="Muted background" tooltipPosition="top" (click)="bg.set(bg() === 'muted' ? 'plain' : 'muted')" aria-label="Toggle muted background"><i class="pi pi-palette"></i></button>
          <span class="zoom-val">{{ (zoom() * 100).toFixed(0) }}%</span>
        </div>
      }
      <div class="canvas-stage" [class.start]="alignStart()" [style.min-height.px]="height()">
        <div class="canvas-zoom" [style.zoom]="zoom()">
          <ng-container *ngTemplateOutlet="tpl(); context: { $implicit: args() }" />
        </div>
      </div>
      <button type="button" class="show-code" (click)="open.set(!open())">{{ open() ? 'Hide code' : 'Show code' }}</button>
    </div>
    @if (open()) {
      <ds-code [code]="code()" lang="html" [flush]="true" />
    }
  `,
})
export class Canvas {
  tpl = input.required<TemplateRef<unknown>>();
  args = input.required<Record<string, unknown>>();
  code = input.required<string>();
  toolbar = input(false);
  height = input(120);
  alignStart = input(false);
  open = signal(false);
  zoom = signal(1);
  bg = signal<Bg>('plain');
  clamp(v: number) { return Math.min(2, Math.max(0.5, v)); }
}

@Component({
  selector: 'ds-doc-page',
  imports: [Canvas, FormsModule, ToggleSwitch, InputText, InputNumber, Select, RadioButton, CodeBlock, Tooltip],
  template: `
    <article class="doc">
      <header class="doc-head">
        <div class="eyebrow">{{ group() }}</div>
        <h1>{{ doc().title }}</h1>
        <p class="lede">{{ doc().description }}</p>
        @if (doc().figma) {
          <div class="meta-row">
            <span class="meta-chip"><i class="pi pi-objects-column"></i> Figma · {{ doc().figma }}</span>
            <span class="meta-chip"><i class="pi pi-sliders-h"></i> {{ doc().args.length }} props</span>
            <span class="meta-chip"><i class="pi pi-bookmark"></i> {{ doc().stories.length }} stories</span>
            @if (doc().selector) { <span class="meta-chip mono"><i class="pi pi-code"></i> &lt;{{ doc().selector }}&gt;</span> }
          </div>
        }
      </header>

      <ds-canvas [tpl]="preview()" [args]="args()" [code]="code()" [toolbar]="true" [height]="doc().canvasHeight ?? 160" [alignStart]="!!doc().alignStart" />

      @if (doc().importCode) {
        <ds-code [code]="doc().importCode!" lang="ts" label="Import" />
      }

      @if (doc().args.length) {
        <div class="table-wrap">
          <table class="args">
            <thead>
              <tr>
                <th>Name</th><th>Description</th><th>Default</th>
                <th class="ctl-head">Control
                  <button type="button" class="icon-btn sm" pTooltip="Reset controls" tooltipPosition="left" (click)="reset()" aria-label="Reset controls"><i class="pi pi-replay"></i></button>
                </th>
              </tr>
            </thead>
            <tbody>
              @for (a of doc().args; track a.name) {
                <tr>
                  <td class="arg-name">{{ a.name }}@if (a.required) {<span class="req">*</span>}@if (isModel(a.name)) {<span class="model-pill" title="Two-way bindable: [(name)]">model</span>}</td>
                  <td class="arg-desc">{{ a.description }}<div><code class="type">{{ a.type }}</code></div></td>
                  <td>@if (a.default !== undefined && a.default !== null && a.default !== '') {<code class="type">{{ fmt(a.default) }}</code>} @else {<span class="muted">–</span>}</td>
                  <td class="ctl">
                    @switch (a.control) {
                      @case ('boolean') {
                        <div class="bool">
                          <p-toggleswitch [inputId]="ctlId(a)" [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" />
                          <label [for]="ctlId(a)">{{ args()[a.name] ? 'True' : 'False' }}</label>
                        </div>
                      }
                      @case ('text') {
                        <input pInputText [id]="ctlId(a)" pSize="small" fluid [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" [attr.aria-label]="a.name" />
                      }
                      @case ('number') {
                        <p-inputnumber [inputId]="ctlId(a)" size="small" fluid [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" [showButtons]="true" [ariaLabel]="a.name" />
                      }
                      @case ('select') {
                        <p-select [inputId]="ctlId(a)" size="small" fluid [options]="opts(a)" optionLabel="label" optionValue="value" [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" appendTo="body" [ariaLabel]="a.name" />
                      }
                      @case ('radio') {
                        <div class="radios">
                          @for (o of a.options; track o) {
                            <label class="radio">
                              <p-radiobutton [name]="ctlId(a)" [value]="o" size="small" [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" />
                              {{ o ?? 'none' }}
                            </label>
                          }
                        </div>
                      }
                      @case ('color') {
                        <div class="color-ctl">
                          <input type="color" [id]="ctlId(a)" [value]="args()[a.name] || '#2bb673'" (input)="set(a.name, $any($event.target).value)" [attr.aria-label]="a.name" />
                          <input pInputText pSize="small" fluid [ngModel]="args()[a.name]" (ngModelChange)="set(a.name, $event)" [attr.aria-label]="a.name + ' hex'" />
                        </div>
                      }
                      @default { <span class="muted">–</span> }
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (doc().events?.length) {
        <h2 class="sec-title">Events</h2>
        <div class="table-wrap">
          <table class="args">
            <thead><tr><th>Output</th><th>Description</th><th>Payload</th></tr></thead>
            <tbody>
              @for (e of doc().events; track e.name) {
                <tr><td class="arg-name">({{ e.name }})</td><td class="arg-desc">{{ e.description }}</td><td><code class="type">{{ e.type }}</code></td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (doc().types?.length) {
        <h2 class="sec-title">Types</h2>
        @for (t of doc().types; track t.name) { <ds-code [code]="t.code" lang="ts" [label]="t.name" /> }
      }

      @if (doc().usage?.length) {
        <h2 class="sec-title">Usage</h2>
        @for (u of doc().usage; track u.title) {
          <section class="usage">
            <h3>{{ u.title }}</h3>
            @if (u.description) { <p class="story-desc">{{ u.description }}</p> }
            @for (f of u.files; track f.label) { <ds-code [code]="f.code" [lang]="f.lang" [label]="f.label" /> }
          </section>
        }
      }

      @if (doc().a11y?.length) {
        <h2 class="sec-title">Accessibility</h2>
        <ul class="a11y">
          @for (n of doc().a11y; track n) { <li><i class="pi pi-check-circle"></i><span>{{ n }}</span></li> }
        </ul>
      }

      @if (doc().stories.length) {
        <div class="eyebrow stories-label">Stories</div>
        @for (s of stories(); track s.id) {
          <section class="story" [id]="s.id">
            <h2><a class="anchor" [href]="'#' + s.id" (click)="go($event, s.id)">{{ s.name }}</a></h2>
            @if (s.description) { <p class="story-desc">{{ s.description }}</p> }
            <ds-canvas [tpl]="preview()" [args]="s.args" [code]="s.code" [height]="doc().canvasHeight ?? 110" [alignStart]="!!doc().alignStart" />
          </section>
        }
      }
      <ng-content />
    </article>
  `,
})
export class DocPage {
  doc = input.required<ComponentDoc>();
  group = input<string>('Components');
  preview = contentChild.required<TemplateRef<unknown>>('preview');
  private nav = inject(NavService);

  args = signal<Record<string, unknown>>({});
  code = computed(() => genCode(this.doc(), this.args()));
  stories = computed(() => {
    const d = this.doc();
    const base = defaultArgs(d);
    return d.stories.map((s) => {
      const args = { ...base, ...s.args };
      return { ...s, id: storyId(d.id, s.name), args, code: genCode(d, args) };
    });
  });

  constructor() {
    effect(() => {
      const d = this.doc();
      this.args.set({ ...defaultArgs(d), ...(d.stories[0]?.args ?? {}) });
    });
  }

  set(name: string, value: unknown) {
    this.args.update((a) => ({ ...a, [name]: value }));
  }
  reset() {
    const d = this.doc();
    this.args.set({ ...defaultArgs(d), ...(d.stories[0]?.args ?? {}) });
  }
  ctlId(a: ArgDef) { return `ctl-${this.doc().id}-${a.name}`; }
  opts(a: ArgDef) { return (a.options ?? []).map((o) => ({ label: o === null ? 'none' : String(o), value: o })); }
  isModel(n: string) { return !!this.doc().models?.includes(n); }
  fmt(v: unknown) { return typeof v === 'string' ? `'${v}'` : String(v); }
  go(e: Event, id: string) { e.preventDefault(); this.nav.go(id); }
}
