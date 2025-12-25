import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Log when worker is created
console.log('MSW Worker created with handlers:', handlers.length);
