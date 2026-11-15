import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import config from "@/config/index";
import { api } from "@/lib/api/client";
import { authStore, useIsSignedIn } from "@/lib/auth/authStore";
import type { ApiSuccess } from "@/types/api";

/**
 * Which cached data each server event makes stale. This knows about several
 * features on purpose: it is the one place that maps events to queries.
 */
const INVALIDATES: Record<string, QueryKey[]> = {
  "order.created": [["orders"]],
  "order.status_changed": [["orders"]],
};

const RETRY_MS = 5000;

/**
 * Keeps one live connection to the API's event stream while signed in, and
 * refetches whatever an event says has changed. No polling.
 *
 * The stream needs a short-lived token (60 s) from /events/token, because
 * EventSource cannot send an Authorization header. When the stream drops for
 * good (the token has expired by then), this gets a fresh token and
 * reconnects, passing the last event id so the API replays what was missed.
 */
export const useLiveUpdates = () => {
  const isSignedIn = useIsSignedIn();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSignedIn) return undefined;

    let source: EventSource | null = null;
    let retryTimer: number | undefined;
    let lastEventId = "";
    let stopped = false;

    const refetchAll = () =>
      Object.values(INVALIDATES)
        .flat()
        .forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

    const reconnectLater = () => {
      source?.close();
      source = null;
      if (!stopped) retryTimer = window.setTimeout(connect, RETRY_MS);
    };

    const connect = async () => {
      try {
        const response =
          await api.get<ApiSuccess<{ url: string }>>("/events/token");
        if (stopped) return;

        // The API returns a path; resolve it against wherever the API lives.
        const apiOrigin = new URL(config.api.baseUrl, window.location.origin);
        const url = new URL(response.data.data.url, apiOrigin);
        if (lastEventId) url.searchParams.set("lastEventId", lastEventId);

        source = new EventSource(url);

        for (const [event, queryKeys] of Object.entries(INVALIDATES)) {
          source.addEventListener(event, (message) => {
            lastEventId = (message as MessageEvent).lastEventId || lastEventId;
            queryKeys.forEach((queryKey) =>
              queryClient.invalidateQueries({ queryKey }),
            );
          });
        }
        // Too much was missed to replay: refetch everything instead.
        source.addEventListener("resync", refetchAll);
        // The server is closing this stream (deploy, or 60 min limit).
        source.addEventListener("reconnect", reconnectLater);
        // An admin suspended the account.
        source.addEventListener("session.revoked", () =>
          authStore.getState().clearSession(),
        );

        source.onerror = () => {
          // While CONNECTING the browser retries by itself. CLOSED means it
          // gave up (usually the expired token), so start again with a new one.
          if (source?.readyState === EventSource.CLOSED) reconnectLater();
        };
      } catch {
        reconnectLater();
      }
    };

    connect();

    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      source?.close();
    };
  }, [isSignedIn, queryClient]);
};
