import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SpecCheckSummary, SpecSummaryRow } from './check-summary';

@Component({
  imports: [SpecCheckSummary],
  template: `<spec-check-summary title="Geometry Check" [status]="status()" [ratio]="140.3" message="Ratio exceeds 100%."
    [rows]="rows" [(expanded)]="open" (fix)="fixed = fixed + 1" />`,
})
class Host {
  status = signal<'pass' | 'fail'>('fail');
  open = signal(false);
  fixed = 0;
  rows: SpecSummaryRow[] = [{ label: 'Timber Member', value: 65.6 }, { label: 'Steel Plate', value: 104.2 }];
}

describe('SpecCheckSummary', () => {
  it('formats the ratio and shows FAIL with the message', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const el: HTMLElement = f.nativeElement;
    expect(el.querySelector('.scs-res-text strong')!.textContent).toContain('FAIL');
    expect(el.querySelector('.scs-res-text span')!.textContent).toBe('140.3%');
    expect(el.querySelector('.scs-alert p')!.textContent).toContain('Ratio exceeds');
  });

  it('emits fix', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    (f.nativeElement.querySelector('.scs-fix') as HTMLButtonElement).click();
    expect(f.componentInstance.fixed).toBe(1);
  });

  it('toggles rows with two-way expanded and aria-expanded', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const toggle = f.nativeElement.querySelector('.scs-toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await f.whenStable();
    expect(f.componentInstance.open()).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const rows = f.nativeElement.querySelectorAll('.scs-row');
    expect(rows.length).toBe(2);
    expect(rows[1].classList).toContain('row-fail');
  });

  it('hides the alert when passing', async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.status.set('pass');
    await f.whenStable();
    expect(f.nativeElement.querySelector('.scs-alert')).toBeNull();
    expect(f.nativeElement.querySelector('.scs-res-text strong').textContent).toContain('PASS');
  });
});
