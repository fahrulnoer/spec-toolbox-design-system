import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { NavService } from './nav.service';
import { ALL_ITEMS, NAV, NavItem } from './registry';
import { storyId } from './docs/types';

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet, FormsModule, Toast, Tooltip],
  templateUrl: './app.html',
})
export class App {
  nav = inject(NavService);
  query = signal('');
  menuOpen = signal(false);
  dark = signal(document.documentElement.classList.contains('app-dark'));
  collapsed = signal<Record<string, boolean>>({});
  expanded = signal<Record<string, boolean>>({});

  current = computed(() => ALL_ITEMS.find((i) => i.id === this.nav.page()) ?? ALL_ITEMS[0]);
  groupOf = computed(() => NAV.find((g) => g.items.includes(this.current()))?.label ?? '');

  groups = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return NAV;
    return NAV.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(q) || g.label.toLowerCase().includes(q) || i.doc?.stories.some((s) => s.name.toLowerCase().includes(q))),
    })).filter((g) => g.items.length);
  });

  constructor() {
    this.nav.register(ALL_ITEMS.map((i) => i.id));
    effect(() => {
      const id = this.nav.page();
      this.expanded.update((e) => ({ ...e, [id]: true }));
      this.menuOpen.set(false);
    });
    // Follow the host theme when it changes (data-theme attribute or OS setting), until the user toggles.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      const t = document.documentElement.getAttribute('data-theme');
      this.setDark(t ? t === 'dark' : mq.matches, false);
    };
    mq.addEventListener?.('change', sync);
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  stories(i: NavItem) {
    return (i.doc?.stories ?? []).map((s) => ({ name: s.name, id: storyId(i.id, s.name) }));
  }

  toggleItem(i: NavItem) {
    this.expanded.update((e) => ({ ...e, [i.id]: !e[i.id] }));
  }

  toggleGroup(label: string) {
    this.collapsed.update((c) => ({ ...c, [label]: !c[label] }));
  }

  setDark(on: boolean, user = true) {
    this.dark.set(on);
    document.documentElement.classList.toggle('app-dark', on);
    if (user) try { localStorage.setItem('spec-ds-theme', on ? 'dark' : 'light'); } catch { /* storage blocked */ }
  }

  onSearchKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const first = this.groups()[0]?.items[0];
      if (first) this.nav.go(first.id);
    }
    if (e.key === 'Escape') this.query.set('');
  }
}
