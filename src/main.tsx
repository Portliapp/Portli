import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign sandbox-specific WebSocket/Vite HMR connection warnings
if (typeof window !== 'undefined') {
  // Safeguard performance telemetry against sandboxed iframe limits and DataCloneErrors
  if (window.performance) {
    const originalMeasure = window.performance.measure;
    if (typeof originalMeasure === 'function') {
      window.performance.measure = function (...args: any[]) {
        try {
          return originalMeasure.apply(this, args);
        } catch (e) {
          return undefined as any;
        }
      };
    }

    const originalMark = window.performance.mark;
    if (typeof originalMark === 'function') {
      window.performance.mark = function (...args: any[]) {
        try {
          return originalMark.apply(this, args);
        } catch (e) {
          return undefined as any;
        }
      };
    }
  }

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const errorMsg = reason?.message || String(reason || '') || '';
      if (
        errorMsg.includes('WebSocket') ||
        errorMsg.includes('websocket') ||
        errorMsg.includes('HMR') ||
        errorMsg.includes('vite') ||
        errorMsg.includes('closed without opened') ||
        errorMsg.includes('connection failed') ||
        errorMsg.includes('failed to connect')
      ) {
        event.preventDefault(); // Suppress the default console trace for unhandled rejections
        event.stopPropagation();
      }
    } catch {
      // Ignore errors in interceptor
    }
  });

  window.addEventListener('error', (event) => {
    try {
      const errorMsg = event.message || '';
      if (
        errorMsg.includes('WebSocket') ||
        errorMsg.includes('websocket') ||
        errorMsg.includes('closed without opened') ||
        errorMsg.includes('HMR') ||
        errorMsg.includes('vite') ||
        errorMsg.includes('connection failed') ||
        errorMsg.includes('failed to connect')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    } catch {
      // Ignore errors in interceptor
    }
  }, true);

  // Filter out benign websocket failure messages from console.error outputs
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const stringified = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch {
        return '';
      }
    }).join(' ');

    if (
      stringified.includes('WebSocket') ||
      stringified.includes('websocket') ||
      stringified.includes('closed without opened') ||
      stringified.includes('failed to connect') ||
      stringified.includes('connection failed') ||
      (stringified.includes('width') && stringified.includes('height') && stringified.includes('greater than 0'))
    ) {
      return; // Do not output sandbox websocket issues
    }
    originalConsoleError.apply(console, args);
  };

  // Filter out benign Recharts dimension warnings from console.warn outputs
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const stringified = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch {
        return '';
      }
    }).join(' ');

    if (
      stringified.includes('should be greater than 0') ||
      stringified.includes('check the style of container') ||
      (stringified.includes('width') && stringified.includes('height') && stringified.includes('greater than 0'))
    ) {
      return; // Do not output Recharts split-second resize alerts
    }
    originalConsoleWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

