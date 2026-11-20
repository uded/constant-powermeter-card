import { vi, type Mock } from 'vitest';
import type { HaConnection, SubscribeOptions } from '../src/types/ha';

export interface MockCall {
  msg: Record<string, unknown>;
  options?: SubscribeOptions;
  cb: (msg: unknown) => void;
  unsub: Mock<() => Promise<void>>;
  /** True when this attempt was made to fail via failNext. */
  rejected?: boolean;
}

export interface MockConnection extends HaConnection {
  calls: MockCall[];
  /** Listeners currently registered for the 'ready' event. */
  readyListeners: Set<() => void>;
  /** Deliver a message to the callback of call `index` (default: the latest call). */
  push(msg: unknown, index?: number): void;
  /** Make the next subscribeMessage call reject with this error. */
  failNext(err: Error): void;
  /** Simulate a reconnect: fire 'ready' on every registered listener. */
  fireReady(): void;
}

/** Fake HA connection that records subscribeMessage calls and lets tests push messages. */
export function mockConnection(): MockConnection {
  const calls: MockCall[] = [];
  const readyListeners = new Set<() => void>();
  let nextError: Error | undefined;
  return {
    calls,
    readyListeners,
    subscribeMessage<T>(
      cb: (msg: T) => void,
      msg: Record<string, unknown>,
      options?: SubscribeOptions,
    ) {
      const unsub = vi.fn(() => Promise.resolve());
      if (nextError) {
        const err = nextError;
        nextError = undefined;
        calls.push({ msg, options, cb: cb as (m: unknown) => void, unsub, rejected: true });
        return Promise.reject(err);
      }
      calls.push({ msg, options, cb: cb as (m: unknown) => void, unsub });
      return Promise.resolve(unsub);
    },
    addEventListener(_event, cb) {
      readyListeners.add(cb);
    },
    removeEventListener(_event, cb) {
      readyListeners.delete(cb);
    },
    push(msg, index = calls.length - 1) {
      calls[index].cb(msg);
    },
    failNext(err) {
      nextError = err;
    },
    fireReady() {
      for (const cb of [...readyListeners]) cb();
    },
  };
}
