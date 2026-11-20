# Changelog

All notable changes to this card. Each release on GitHub uses its section from this file as release notes.

## [0.1.5] - 2026-11-20

### Fixed

- Sparkline lines are visible again. Since 0.1.2 a layout style meant for the row also matched the sparkline's line, so only the faint area fill under it was drawn. The line is now a crisp 2 px stroke in the level colors.

### Changed

- The area fill under the sparkline is a little stronger (20% instead of 15%).
- The line width can be tuned with the CSS variable `--cpm-line-width` (default `2px`), for example through card-mod or your theme.

## [0.1.4] - 2026-11-20

### Added

- Sections dashboards: the card now tells Home Assistant how to size it. It is full width by default, can be shrunk to half width, and its height follows the number of meters.

### Fixed

- No more `history/stream subscription failed` error in the browser console when the connection to Home Assistant drops at the moment the card subscribes. The card already resubscribed on its own; the error was only noise. Real failures are still logged.

### Documentation

- The README now shows a screenshot of the card.
- The repository passes the HACS validation check, which now runs on every push and weekly.

## [0.1.3] - 2026-11-20

### Added

- When a sensor reports a new reading, the number counts smoothly from the old value to the new one over half a second, and the bar slides at the same pace. Only real readings are shown; nothing is simulated between updates. With reduced motion enabled in your OS, values switch instantly.

## [0.1.2] - 2026-11-20

### Added

- Entity pickers in the visual editor hide sensors that are already used by another meter in the same card. A meter's own sensor stays available in its picker.

### Fixed

- Sparklines and values line up across all meters in a panel. The value column is as wide as the widest value, so every sparkline starts and ends at the same place.

## [0.1.1] - 2026-11-20

### Fixed

- After a reconnect (tab in the background, Home Assistant restart, Wi-Fi drop) the card now asks only for the last configured hours of history. Before, it requested everything since the page was opened, which grew larger the longer a dashboard stayed open.
- Level colors accept any CSS color: names like `blue`, `hsl(...)`, and `var(--x, #abc)` with a fallback. Before, anything other than hex or `rgb()` silently fell back to the default green.
- The visual editor loads Home Assistant's form components before it renders, so it no longer shows up blank when it is the first editor opened after a page load.
- Setting only one threshold no longer moves it. For example `critical: 2500` with `max: 5000` used to make red start at 3000, because a derived default sorted above it. Derived defaults now stay inside the range your explicit thresholds allow.

### Added

- A link to the documentation in the card picker.
- A version line in the browser console, for example `constant-powermeter-card v0.1.1`, to tell which version is loaded.
- MIT license.

## [0.1.0] - 2026-11-20

First release.

- Several power meters in one card, each with its own `normal`, `warning` and `critical` thresholds, `min`, `max`, name and unit.
- Each meter shows its current value with a sparkline of recent history, a bar, or both. The sparkline sits between the name and the value.
- Level colors are shared by the whole panel and default to your theme's success, warning and error colors. Values between thresholds blend smoothly, or step with `blend: false`.
- Two-sided meters for solar, grid or battery sensors: set `min` below zero and the bar grows left or right from zero.
- Clicking a meter opens its more-info dialog. Per meter, the tap action can navigate, open a URL, or do nothing instead.
- Visual editor for everything, including per-meter thresholds with a live preview strip of the color bands.
- Native Home Assistant look: uses `ha-card` and your theme's colors and fonts.
- History comes from one `history/stream` subscription per card.

[0.1.5]: https://github.com/uded/constant-powermeter-card/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/uded/constant-powermeter-card/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/uded/constant-powermeter-card/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/uded/constant-powermeter-card/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/uded/constant-powermeter-card/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/uded/constant-powermeter-card/releases/tag/v0.1.0
