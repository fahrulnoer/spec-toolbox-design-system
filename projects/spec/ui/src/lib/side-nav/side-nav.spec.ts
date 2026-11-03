import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SpecNavItem, SpecNavSection, SpecSideNav } from './side-nav';

@Component({
  imports: [SpecSideNav],
  template: `<spec-side-nav [workspace]="{ name: 'Personal Project', type: 'Personal', level: 'Pro' }" [sections]="sections" [(activeId)]="active" (itemSelect)="picked = $event" />`,
})
class Host {
  active = signal<string | null>('new');
  picked: SpecNavItem | null = null;
  sections: SpecNavSection[] = [
    { label: 'Projects', items: [
      { id: 'new', label: 'New Calculator', icon: 'pi pi-calculator' },
      { id: 'draft', label: 'Draft', icon: 'pi pi-file', badge: 2 },
      { id: 'locked', label: 'Archive', disabled: true },
    ] },
  ];
}

describe('SpecSideNav', () => {
  it('marks the active item with aria-current', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const current = f.nativeElement.querySelector('[aria-current=page]');
    expect(current.textContent).toContain('New Calculator');
  });

  it('updates activeId and emits itemSelect', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const items = f.nativeElement.querySelectorAll('.ssn-item') as NodeListOf<HTMLButtonElement>;
    items[1].click();
    await f.whenStable();
    expect(f.componentInstance.active()).toBe('draft');
    expect(f.componentInstance.picked?.id).toBe('draft');
    expect(items[1].querySelector('.ssn-cnt')!.textContent).toBe('2');
  });

  it('does not select disabled items', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const items = f.nativeElement.querySelectorAll('.ssn-item') as NodeListOf<HTMLButtonElement>;
    expect(items[2].disabled).toBe(true);
  });
});
