import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// need to use browser router for client-side routing, but it causes issues with direct refreshes on non-root paths.
// For a production build, consider using HashRouter or configuring the server to handle client-side routing properly. why???