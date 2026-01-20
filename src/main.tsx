import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';

import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import { Provider } from 'react-redux';

async function initializeApp() {
  const { runMigrations } = await import('./mocks/schema');
  await runMigrations();

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('Starting MSW...');
  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker
    .start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'warn',
    })
    .then(() => {
      console.log('MSW started successfully!');
    });
}

initializeApp().then(async () => {
  console.log('Rendering app...');

  const { router } = await import('./router');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>,
  );
});
