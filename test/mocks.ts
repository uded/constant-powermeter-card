import { vi, type Mock } from 'vitest';
import type { HaConnection } from '../src/types/ha';

export interface MockCall {
  msg: Record<string, unknown>;
  cb: (msg: unknown) => void;
  unsub: Mock<() => Promise<void>>;
}

export interface MockConnection extends HaConnection {
  calls: MockCall[];
  /** Deliver a message to the callback of call `index` (default: the latest call). */
  push(msg: unknown, index?: number): void;
  /** Make the next subscribeMessage call reject with this error. */
  failNext(err: Error): void;
}

/** Fake HA connection that records subscribeMessage calls and lets tests push messages. */
export function mockConnection(): MockConnection {
  const calls: MockCall[] = [];
  let nextError: Error | undefined;
  return {
    calls,
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>) {
      if (nextError) {
        const err = nextError;
        nextError = undefined;
        return Promise.reject(err);
      }
      const unsub = vi.fn(() => Promise.resolve());
      calls.push({ msg, cb: cb as (m: unknown) => void, unsub });
      return Promise.resolve(unsub);
    },
    push(msg, index = calls.length - 1) {
      calls[index].cb(msg);
    },
    failNext(err) {
      nextError = err;
    },
  };
}
