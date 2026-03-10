/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { useCallback, useEffect, useRef } from "react";
import type { Result as VegaEmbedResult } from "vega-embed";

type SignalHandler = (signalName: string, signalValue: unknown) => void;

export function useVegaSignalEmbed(
  signalListenerMap: Record<string, SignalHandler>,
): (result: VegaEmbedResult) => void {
  // Keep cleanup in a ref so it can run on re-embed and unmount.
  const cleanupRef = useRef<null | (() => void)>(null);

  const onEmbed = useCallback(
    (result: VegaEmbedResult) => {
      cleanupRef.current?.();
      cleanupRef.current = null;

      const view = result?.view;
      if (!view) return;

      /*
       * Keep track of the exact listener functions registered on the Vega view.
       * Vega requires the same function reference for removal, so we store them
       * here in order to properly clean them up on re-embed or unmount.
       */
      const attachedListeners: Array<{
        name: string;
        fn: (name: string, value: unknown) => void;
      }> = [];

      for (const [signalName, handler] of Object.entries(signalListenerMap)) {
        const fn = (name: string, value: unknown) => handler(name, value);
        view.addSignalListener(signalName, fn);
        attachedListeners.push({ name: signalName, fn });
      }

      cleanupRef.current = () => {
        for (const { name, fn } of attachedListeners) {
          view.removeSignalListener(name, fn);
        }
      };
    },
    [signalListenerMap],
  );

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return onEmbed;
}
