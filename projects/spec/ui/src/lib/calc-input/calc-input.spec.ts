import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecCalcInput } from './calc-input';

@Component({
  imports: [SpecCalcInput, ReactiveFormsModule],
  template: `<spec-calc-input label="Span" unit="mm" [formControl]="ctrl" warning="Too long" />`,
})
class FormHost {
  ctrl = new FormControl<number | null>(4800, [Validators.max(12000)]);
}

@Component({
  imports: [SpecCalcInput],
  template: `<spec-calc-input label="Span" [(value)]="v" state="readonly" />`,
})
class ModelHost {
  v = signal<number | string | null>(120);
}

function input(el: HTMLElement) {
  return el.querySelector('input') as HTMLInputElement;
}

describe('SpecCalcInput', () => {
  it('writes the form value into the field', async () => {
    const f = TestBed.createComponent(FormHost);
    await f.whenStable();
    expect(input(f.nativeElement).value).toBe('4800');
  });

  it('pushes typed numbers to the form control', async () => {
    const f = TestBed.createComponent(FormHost);
    await f.whenStable();
    const el = input(f.nativeElement);
    el.value = '5200';
    el.dispatchEvent(new Event('input'));
    expect(f.componentInstance.ctrl.value).toBe(5200);
    el.value = '';
    el.dispatchEvent(new Event('input'));
    expect(f.componentInstance.ctrl.value).toBeNull();
  });

  it('shows the warning when the control is invalid and touched', async () => {
    const f = TestBed.createComponent(FormHost);
    await f.whenStable();
    f.componentInstance.ctrl.setValue(15000);
    f.componentInstance.ctrl.markAsTouched();
    await f.whenStable();
    expect(f.nativeElement.querySelector('.sci-calc').classList).toContain('sci-is-warning');
    expect(f.nativeElement.querySelector('.sci-warn').textContent).toContain('Too long');
    expect(input(f.nativeElement).getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the native input through the form API', async () => {
    const f = TestBed.createComponent(FormHost);
    await f.whenStable();
    f.componentInstance.ctrl.disable();
    await f.whenStable();
    expect(input(f.nativeElement).disabled).toBe(true);
  });

  it('supports [(value)] and read-only state', async () => {
    const f = TestBed.createComponent(ModelHost);
    await f.whenStable();
    const el = input(f.nativeElement);
    expect(el.readOnly).toBe(true);
    expect(el.value).toBe('120');
    el.value = '90';
    el.dispatchEvent(new Event('input'));
    expect(f.componentInstance.v()).toBe(90);
  });

  it('links the label to the input', async () => {
    const f = TestBed.createComponent(ModelHost);
    await f.whenStable();
    const label = f.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.htmlFor).toBe(input(f.nativeElement).id);
  });
});
