/** HA's user locale: the language, plus the "Number format" choice from the profile page. */
export interface HaLocale {
  language: string;
  number_format?: string;
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
