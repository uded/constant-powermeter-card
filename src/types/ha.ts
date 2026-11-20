export interface HassEntity {
  entity_id: string;
  state: string;
  last_updated: string;
  attributes: { friendly_name?: string; unit_of_measurement?: string; [k: string]: unknown };
}

export interface HaConnection {
  subscribeMessage<T>(
    cb: (msg: T) => void,
    msg: Record<string, unknown>,
  ): Promise<() => Promise<void>>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, { display_precision?: number }>;
  themes: { darkMode: boolean; [k: string]: unknown };
  locale?: { language: string };
  connection: HaConnection;
}
