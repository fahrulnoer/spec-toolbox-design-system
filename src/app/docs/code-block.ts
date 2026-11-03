import { Component, computed, input, signal } from '@angular/core';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Tiny highlighter for HTML templates, TS and shell snippets. */
const RULES: Record<string, [RegExp, string][]> = {
  html: [[/<!--[\s\S]*?-->/y, 't-com'], [/<\/?[a-zA-Z][\w-]*/y, 't-tag'], [/"[^"]*"/y, 't-str'], [/[\[(]?[@\w.\-]+[\])]?(?==)/y, 't-attr']],
  bash: [[/#.*/y, 't-com'], [/(?<=^|\n)(npm|npx|ng)\b/y, 't-kw']],
  ts: [[/\/\/.*/y, 't-com'], [/'[^'\n]*'/y, 't-str'], [/\b(import|from|export|const|let|return|new|function|class|this|true|false)\b/y, 't-kw']],
};

/** Single-pass tokenizer so highlighting never re-processes its own markup. */
export function highlight(code: string, lang: string): string {
  const rules = RULES[lang === 'scss' ? 'ts' : lang] ?? [];
  let out = '';
  let i = 0;
  let plain = '';
  outer: while (i < code.length) {
    for (const [re, cls] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length) {
        out += esc(plain); plain = '';
        out += `<span class="${cls}">${esc(m[0])}</span>`;
        i += m[0].length;
        continue outer;
      }
    }
    plain += code[i++];
  }
  return out + esc(plain);
}

@Component({
  selector: 'ds-code',
  template: `
    <div class="code" [class.flush]="flush()">
      @if (label()) {
        <div class="code-head">
          <span>{{ label() }}</span>
          <button type="button" class="copy" (click)="copy()">
            <i class="pi" [class.pi-copy]="!copied()" [class.pi-check]="copied()"></i>
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
        </div>
      } @else {
        <button type="button" class="copy floating" (click)="copy()" [attr.aria-label]="'Copy code'">
          <i class="pi" [class.pi-copy]="!copied()" [class.pi-check]="copied()"></i>
          {{ copied() ? 'Copied' : 'Copy' }}
        </button>
      }
      <pre><code [innerHTML]="html()"></code></pre>
    </div>
  `,
})
export class CodeBlock {
  code = input.required<string>();
  lang = input<'html' | 'ts' | 'bash' | 'scss'>('html');
  label = input<string>('');
  flush = input(false);
  copied = signal(false);
  html = computed(() => highlight(this.code(), this.lang()));

  copy() {
    const done = () => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1400);
    };
    try {
      navigator.clipboard.writeText(this.code()).then(done, () => this.fallback(done));
    } catch {
      this.fallback(done);
    }
  }

  private fallback(done: () => void) {
    const ta = document.createElement('textarea');
    ta.value = this.code();
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch { /* ignore */ }
    ta.remove();
  }
}
