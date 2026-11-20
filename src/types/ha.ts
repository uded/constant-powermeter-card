export interface HassEntity {
  entity_id: string;
  state: string;
  last_updated: string;
  attributes: { friendly_name?: string; unit_of_measurement?: string; [k: string]: unknown };
}

/** Options accepted by home-assistant-js-websocket's subscribeMessage. */
export interface SubscribeOptions {
  /** When false, the library does not replay the original message after a reconnect. */
  resubscribe?: boolean;
}

/** The subset of the home-assistant-js-websocket Connection the card uses. */
export interface HaConnection {
  subscribeMessage<T>(
    cb: (msg: T) => void,
    msg: Record<string, unknown>,
    options?: SubscribeOptions,
  ): Promise<() => Promise<void>>;
  /** 'ready' fires after the socket has reconnected. */
  addEventListener(event: 'ready', cb: () => void): void;
  removeEventListener(event: 'ready', cb: () => void): void;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, { display_precision?: number }>;
  themes: { darkMode: boolean; [k: string]: unknown };
  locale?: { language: string };
  connection: HaConnection;
}
