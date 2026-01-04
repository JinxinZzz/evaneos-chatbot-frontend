// src/mocks/setup.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export let worker: ReturnType<typeof setupWorker> | undefined;

if (typeof window !== 'undefined') {
  worker = setupWorker(...handlers);
}