import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ErrorBoundary from './ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const app = document.getElementById('app');

createInertiaApp({
  resolve: name => {
    // Substitua './' pelo caminho relativo correto ao diretório Pages
    return import.meta.glob('./Pages/**/*.jsx')[`./Pages/${name}.jsx`]();
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ErrorBoundary>
        <App {...props} />
      </ErrorBoundary>);
  },

});


