import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const rootEl = document.getElementById('root');

function showBootError(message: string) {
  if (!rootEl) return;
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0F1419;color:#f5f5f4;padding:24px;font-family:system-ui,sans-serif;">
      <div style="max-width:640px;">
        <h1 style="font-size:24px;margin-bottom:12px;">DirectHome failed to load</h1>
        <p style="opacity:0.8;margin-bottom:16px;">Open the browser console for details, then refresh.</p>
        <pre style="white-space:pre-wrap;background:#151B22;padding:16px;border-radius:8px;overflow:auto;">${message}</pre>
      </div>
    </div>
  `;
}

window.addEventListener('error', (event) => {
  showBootError(event.error?.stack || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  showBootError(reason?.stack || String(reason));
});

if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);