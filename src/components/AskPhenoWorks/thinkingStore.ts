import {useSyncExternalStore} from 'react';

/**
 * Shares "the assistant is working" between the chat panel and the floating
 * trigger.
 *
 * The trigger's icon slot only receives `isOpen`, so the chat's own loader
 * publishes its lifetime here instead: the loader mounts exactly while a turn
 * is in flight, which is the same window the mascot should look busy for.
 */

let thinking = false;
const listeners = new Set<() => void>();

/** Publish whether a chat turn is currently in flight. @param next - The new state. */
export function setChatThinking(next: boolean): void {
  if (thinking === next) return;
  thinking = next;
  listeners.forEach((listener) => listener());
}

/** Subscribe to changes. @param listener - Called on every transition. */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return thinking;
}

/** Server renders never have a turn in flight, so the shell always matches. */
function getServerSnapshot(): boolean {
  return false;
}

/** Read whether a chat turn is currently in flight. */
export function useChatThinking(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
