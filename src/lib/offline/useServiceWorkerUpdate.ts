import { useSyncExternalStore } from "react";
import {
  applyServiceWorkerUpdate,
  dismissServiceWorkerUpdate,
  getSWUpdateSnapshot,
  subscribeSWUpdate,
} from "@/lib/offline/swUpdate";

export const useServiceWorkerUpdate = () => {
  const needRefresh = useSyncExternalStore(
    subscribeSWUpdate,
    getSWUpdateSnapshot,
  );

  return {
    needRefresh,
    reload: applyServiceWorkerUpdate,
    dismiss: dismissServiceWorkerUpdate,
  };
};
