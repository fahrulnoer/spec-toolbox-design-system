import { Type } from '@angular/core';
import { ComponentDoc } from './docs/types';
import * as F from './pages/foundations';
import * as S from './pages/spec-docs';
import * as Fm from './pages/form-docs';
import * as M from './pages/more-docs';

export interface NavItem { id: string; label: string; component: Type<unknown>; doc?: ComponentDoc; kind: 'doc' | 'page'; }
export interface NavGroup { label: string; items: NavItem[]; }

const page = (id: string, label: string, component: Type<unknown>): NavItem => ({ id, label, component, kind: 'page' });
const doc = (d: ComponentDoc, component: Type<unknown>): NavItem => ({ id: d.id, label: d.title, component, doc: d, kind: 'doc' });

export const NAV: NavGroup[] = [
  { label: 'Getting started', items: [page('introduction', 'Introduction', F.IntroPage), page('installation', 'Installation', F.InstallPage)] },
  { label: 'Foundations', items: [page('colors', 'Colours', F.ColorsPage), page('typography', 'Typography', F.TypographyPage), page('tokens', 'Design tokens', F.TokensPage), page('icons', 'Icons', F.IconsPage)] },
  {
    label: 'SPEC Components',
    items: [
      doc(S.calcInputDoc, S.CalcInputPage), doc(S.checkSummaryDoc, S.CheckSummaryPage), doc(S.segmentedDoc, S.SegmentedPage),
      doc(S.discussionDoc, S.DiscussionPage), doc(S.statusBadgeDoc, S.StatusBadgePage), doc(S.headerDoc, S.HeaderPage), doc(S.sideNavDoc, S.SideNavPage), doc(S.logoDoc, S.LogoPage),
    ],
  },
  { label: 'Button', items: [doc(Fm.buttonDoc, Fm.ButtonPage)] },
  {
    label: 'Form',
    items: [
      doc(Fm.inputTextDoc, Fm.InputTextPage), doc(Fm.inputNumberDoc, Fm.InputNumberPage), doc(Fm.selectDoc, Fm.SelectPage), doc(Fm.multiSelectDoc, Fm.MultiSelectPage),
      doc(Fm.datePickerDoc, Fm.DatePickerPage), doc(Fm.checkboxDoc, Fm.CheckboxPage), doc(Fm.radioDoc, Fm.RadioPage), doc(Fm.toggleDoc, Fm.TogglePage),
      doc(Fm.selectButtonDoc, Fm.SelectButtonPage), doc(Fm.textareaDoc, Fm.TextareaPage), doc(Fm.sliderDoc, Fm.SliderPage),
    ],
  },
  { label: 'Data', items: [doc(M.tableDoc, M.TablePage), doc(M.paginatorDoc, M.PaginatorPage)] },
  { label: 'Panel', items: [doc(M.cardDoc, M.CardPage), doc(M.accordionDoc, M.AccordionPage), doc(M.tabsDoc, M.TabsPage)] },
  { label: 'Overlay', items: [doc(M.dialogDoc, M.DialogPage), doc(M.tooltipDoc, M.TooltipPage), doc(M.toastDoc, M.ToastPage)] },
  { label: 'Messages', items: [doc(M.messageDoc, M.MessagePage)] },
  {
    label: 'Misc',
    items: [doc(M.tagDoc, M.TagPage), doc(M.badgeDoc, M.BadgePage), doc(M.avatarDoc, M.AvatarPage), doc(M.chipDoc, M.ChipPage), doc(M.progressDoc, M.ProgressPage), doc(M.skeletonDoc, M.SkeletonPage)],
  },
];

export const ALL_ITEMS = NAV.flatMap((g) => g.items);
export const DOC_COUNT = ALL_ITEMS.filter((i) => i.kind === 'doc').length;
