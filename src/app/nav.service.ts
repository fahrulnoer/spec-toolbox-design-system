import { Injectable, signal } from '@angular/core';

/**
 * Hash navigation with plain `#name` anchors (e.g. `#button`, `#button-outlined`).
 * Page ids are registered by the registry; story anchors are `<pageId>-<story>`.
 */
@Injectable({ providedIn: 'root' })
export class NavService {
  readonly page = signal('introduction');
  readonly anchor = signal<string | null>(null);
  private pageIds: string[] = [];

  register(ids: string[]) {
    // Longest first so `input-number-...` resolves before `input-...`.
    this.pageIds = [...ids].sort((a, b) => b.length - a.length);
    this.fromHash();
    window.addEventListener('hashchange', () => this.fromHash());
  }

  go(id: string) {
    if (location.hash.slice(1) === id) this.resolve(id);
    else location.hash = id;
  }

  private fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    this.resolve(h || 'introduction');
  }

  private resolve(id: string) {
    const page = this.pageIds.find((p) => id === p || id.startsWith(p + '-')) ?? 'introduction';
    const changed = page !== this.page();
    this.page.set(page);
    this.anchor.set(id === page ? null : id);
    setTimeout(() => {
      const main = document.querySelector('.main');
      const el = id !== page ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: changed ? 'auto' : 'smooth', block: 'start' });
      else if (main) main.scrollTo({ top: 0 });
    }, changed ? 60 : 0);
  }
}
