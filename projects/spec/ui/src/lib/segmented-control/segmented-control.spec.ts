import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpecSegmentedControl, SpecSegmentedOption } from './segmented-control';

@Component({
  imports: [SpecSegmentedControl, ReactiveFormsModule],
  template: `<spec-segmented [options]="options" [formControl]="ctrl" ariaLabel="Units" (changed)="last = $event" />`,
})
class Host {
  options: SpecSegmentedOption<string>[] = [
    { label: 'Metric', value: 'si' },
    { label: 'Imperial', value: 'us' },
    { label: 'Mixed', value: 'mix', disabled: true },
  ];
  ctrl = new FormControl('si');
  last: unknown = null;
}

function radios(el: HTMLElement) {
  return Array.from(el.querySelectorAll<HTMLButtonElement>('[role=radio]'));
}

describe('SpecSegmentedControl', () => {
  it('renders a labelled radiogroup with the form value checked', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role=radiogroup]').getAttribute('aria-label')).toBe('Units');
    expect(radios(f.nativeElement).map((r) => r.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
  });

  it('updates the control and emits on click', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    radios(f.nativeElement)[1].click();
    await f.whenStable();
    expect(f.componentInstance.ctrl.value).toBe('us');
    expect(f.componentInstance.last).toBe('us');
  });

  it('moves with arrow keys and skips disabled options', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const [first, second] = radios(f.nativeElement);
    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await f.whenStable();
    // “Mixed” is disabled, so ArrowRight from Imperial wraps to Metric.
    expect(f.componentInstance.ctrl.value).toBe('si');
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    await f.whenStable();
    expect(f.componentInstance.ctrl.value).toBe('us');
  });

  it('uses roving tabindex', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    expect(radios(f.nativeElement).map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  });

  it('disables every option when the control is disabled', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    f.componentInstance.ctrl.disable();
    await f.whenStable();
    expect(radios(f.nativeElement).every((r) => r.disabled)).toBe(true);
  });
});
