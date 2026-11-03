export type ControlType = 'boolean' | 'text' | 'number' | 'select' | 'radio' | 'color' | 'none';

export interface ArgDef {
  name: string;
  description: string;
  /** Type shown in the table, e.g. `string`, `boolean`, `'small' | 'large'`. */
  type: string;
  default?: unknown;
  control: ControlType;
  options?: (string | number | null)[];
  required?: boolean;
  /** Leave out of generated code (e.g. event handlers, preview-only args). */
  noCode?: boolean;
  /** Emit as an event binding in code, e.g. `(onClick)`. */
  event?: boolean;
}

export interface Story {
  name: string;
  description?: string;
  args: Record<string, unknown>;
}

export interface EventDef {
  name: string;
  description: string;
  /** Payload type, e.g. `void`, `MouseEvent`, `SpecNavItem`. */
  type: string;
}

export interface UsageExample {
  title: string;
  description?: string;
  /** One or more files, e.g. a template and its component class. */
  files: { label: string; lang: 'html' | 'ts' | 'scss' | 'bash'; code: string }[];
}

export interface ComponentDoc {
  id: string;
  title: string;
  description: string;
  /** Import line shown in the usage block. */
  importCode?: string;
  /** Selector used by the code generator. Ignored when `code` is provided. */
  tag?: string;
  selfClosing?: boolean;
  /** Custom code generator; receives the current args. */
  code?: (args: Record<string, unknown>) => string;
  args: ArgDef[];
  stories: Story[];
  /** Figma page this component lives on. */
  figma?: string;
  /** Preview canvas min-height. */
  canvasHeight?: number;
  /** Left-align preview content instead of centering. */
  alignStart?: boolean;
  /** Outputs table. */
  events?: EventDef[];
  /** Two-way bindable inputs (`model()`), listed with a note. */
  models?: string[];
  /** Exported TypeScript types worth knowing. */
  types?: { name: string; code: string }[];
  /** Full usage recipes (template + class). */
  usage?: UsageExample[];
  /** Accessibility notes. */
  a11y?: string[];
  /** Selector shown in the header, e.g. `spec-calc-input`. */
  selector?: string;
}

export function defaultArgs(doc: ComponentDoc): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const a of doc.args) out[a.name] = a.default;
  return out;
}

export function storyId(docId: string, name: string): string {
  return `${docId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

/** Generic Angular template generator: `<p-tag value="New" severity="success" [rounded]="true" />`. */
export function genCode(doc: ComponentDoc, args: Record<string, unknown>): string {
  if (doc.code) return doc.code(args);
  const tag = doc.tag ?? 'div';
  const parts: string[] = [];
  for (const def of doc.args) {
    if (def.noCode) continue;
    const v = args[def.name];
    if (def.event) {
      parts.push(`(${def.name})="handle${cap(def.name.replace(/^on/, ''))}($event)"`);
      continue;
    }
    if (v === undefined || v === null || v === '' || v === def.default) continue;
    if (typeof v === 'boolean') parts.push(v ? def.name : `[${def.name}]="false"`);
    else if (typeof v === 'number') parts.push(`[${def.name}]="${v}"`);
    else parts.push(`${def.name}="${String(v)}"`);
  }
  return formatTag(tag, parts, doc.selfClosing !== false);
}

export function formatTag(tag: string, attrs: string[], selfClosing = true, inner = ''): string {
  const oneLine = `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const open = oneLine.length > 72 ? `<${tag}\n  ${attrs.join('\n  ')}\n` : oneLine;
  const sep = oneLine.length > 72 ? '' : ' ';
  if (selfClosing && !inner) return `${open}${sep}/>`;
  return `${open}>${inner ? '\n  ' + inner.split('\n').join('\n  ') + '\n' : ''}</${tag}>`;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
