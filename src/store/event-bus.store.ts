import { create } from 'zustand';
import { AppEvent } from './lib/app-event';

type Bus = { publish: (event: AppEvent) => void; subscribe: (executionCallback: (event: AppEvent) => void) => () => void };

export const useEventBus = create<Bus>(() => {
  const listeners = new Set<(event: AppEvent) => void>();
  return {
    publish: (event) => listeners.forEach((listener) => listener(event)),
    subscribe: (executionCallback) => {
      listeners.add(executionCallback);
      return () => listeners.delete(executionCallback);
    },
  };
});
