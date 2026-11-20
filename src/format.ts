/** HA's user locale: the language, plus the "Number format" choice from the profile page. */
export interface HaLocale {
  language: string;
  number_format?: string;
  time_format?: string;
}

/**
 * hour12 maps HA's Time format profile setting to Intl's hour12: `12` and `24` force
 * the clock, `system` follows the browser, and `language` (or nothing) follows the language.
 */
export function hour12(locale?: HaLocale): boolean | undefined {
  switch (locale?.time_format) {
    case '12':
      return true;
    case '24':
      return false;
    case 'system':
      return new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
    default:
      return undefined;
  }
}

/**
 * numberFormat picks Intl locales and grouping from HA's number format setting, the
 * same way the HA frontend does, so the card shows numbers like the built-in cards.
 */
export function numberFormat(locale: HaLocale | undefined): {
  locales: string | string[] | undefined;
  useGrouping: boolean;
} {
  switch (locale?.number_format) {
    case 'comma_decimal':
      return { locales: ['en-US', 'en'], useGrouping: true };
    case 'decimal_comma':
      return { locales: ['de', 'es', 'it'], useGrouping: true };
    case 'space_comma':
      return { locales: ['fr', 'sv', 'cs'], useGrouping: true };
    case 'quote_decimal':
      return { locales: ['de-CH'], useGrouping: true };
    case 'system':
      return { locales: undefined, useGrouping: true };
    case 'none':
      return { locales: ['en-US', 'en'], useGrouping: false };
    default:
      return { locales: locale?.language, useGrouping: true };
  }
}
