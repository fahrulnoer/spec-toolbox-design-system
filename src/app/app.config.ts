import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { MessageService } from 'primeng/api';
import { provideSpecUI } from '@spec/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    MessageService,
    provideSpecUI(),
  ],
};
