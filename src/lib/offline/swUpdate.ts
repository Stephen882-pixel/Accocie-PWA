import { registerSW } from "virtual:pwa-register";

type UpdateListener = () => void;

const listeners = new Set<UpdateListener>();

let needRefresh = false;
let applyUpdate: (() => void) | null = null;

const notify = () => listeners.forEach((listener) => listener());

/**
 * Registers the service worker. When a new build has installed and is
 * waiting, `UpdatePrompt` is told so the user can reload when it suits them.
 */
export const registerServiceWorkerUpdates = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      applyUpdate = () => updateSW(true);
      needRefresh = true;
      notify();
    },
  });
};

/** Subscribe to update availability. Returns an unsubscribe function. */
export const subscribeSWUpdate = (listener: UpdateListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSWUpdateSnapshot = () => needRefresh;

/** Activate the waiting service worker and reload the page. */
export const applyServiceWorkerUpdate = () => applyUpdate?.();

export const dismissServiceWorkerUpdate = () => {
  needRefresh = false;
  notify();
};
