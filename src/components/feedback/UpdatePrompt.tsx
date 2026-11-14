import { RefreshCw } from "lucide-react";
import { useServiceWorkerUpdate } from "@/lib/offline/useServiceWorkerUpdate";

/** Offers a waiting new build. Sits just above the TabBar. */
const UpdatePrompt = () => {
  const { needRefresh, reload, dismiss } = useServiceWorkerUpdate();

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.5rem)] z-40">
      <div
        role="status"
        aria-live="polite"
        className="shell-column flex items-center gap-3"
      >
        <div className="flex w-full items-center gap-3 rounded-card border border-grey-300 bg-white p-3 shadow-sm">
          <p className="flex-1 text-sm font-medium text-grey-700">
            A new version is available.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="h-11 rounded-control px-3 text-sm font-medium text-grey-700"
          >
            Later
          </button>
          <button
            type="button"
            onClick={reload}
            className="flex h-11 items-center gap-1.5 rounded-control bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <RefreshCw size={16} />
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
