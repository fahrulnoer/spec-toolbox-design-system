import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Initial theme: host data-theme attribute → saved choice → OS setting.
(() => {
  const root = document.documentElement;
  let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const saved = localStorage.getItem('spec-ds-theme');
    if (saved) dark = saved === 'dark';
  } catch { /* storage blocked */ }
  const host = root.getAttribute('data-theme');
  if (host) dark = host === 'dark';
  root.classList.toggle('app-dark', dark);
})();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
