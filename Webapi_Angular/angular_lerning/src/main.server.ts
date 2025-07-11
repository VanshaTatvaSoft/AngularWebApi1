import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

if (typeof global !== 'undefined' && typeof global.alert === 'undefined') {
  (global as any).alert = function () {
    // Optional: log to server console
    console.warn('[SSR] alert() was called but suppressed.');
  };
}

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
