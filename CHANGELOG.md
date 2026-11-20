# Changelog

All notable changes to this card. Each release on GitHub uses its section from this file as release notes.

## [0.3.0] - 2026-11-20

### Added

- Tooltips on the combined charts. Hover over the stacked or lines chart, or touch and drag on it, to see a guide line and a box with that moment's time and every meter's value, plus Untracked and the total. The values are exactly what the chart draws there (the average for stacked, the peak for lines); a missing reading shows `—`, and the live last point is labeled `Now`. The time follows the 12 or 24 hour clock set in your Home Assistant profile.
- Hover or tap a donut slice to see its name, value and share.
- Handy with `rows: false`: the chart alone now tells you the numbers. On touch, the box stays 3 seconds after you lift your finger, and vertical swipes still scroll the dashboard.

## [0.2.1] - 2026-11-20

### Changed

- The combined charts are always in watts. A meter without a unit is read as watts, and `w` and `kw` are accepted in any letter case, so the chart no longer depends on how a sensor spells its unit.
- A meter in a unit that is not power, for example a battery's `kWh`, a state of charge in `%`, a current in `A` or apparent power in `VA`, now stays a normal row with its sparkline, bar and value, but is left out of the stacked chart, lines, donut and shares. Before, its raw number was added to the watts, which gave a wrong total and wrong shares. Its row has no color swatch or share, so you can tell it is not in the chart.
- A `total` that does not report power is ignored, so no Untracked is drawn from it.
- The visual editor no longer shows "Meters use different units; the combined chart may be misleading". It lists the meters left out of the chart instead, for example `Not in chart: Battery (kWh), SoC (%)`.

## [0.2.0] - 2026-11-20

Existing cards without `chart` look and behave exactly as before.

### Added

- Combined charts above the meter rows, so you can see where your power goes at a glance. Set `chart` to `stacked` (stacked areas over time, one layer per meter), `lines` (one line per meter) or `donut` (the current split). You can combine one time chart with the donut, for example `chart: [stacked, donut]`. Negative meters such as export or battery discharge stack below the zero line, and the donut leaves them out.
- `total`: an optional whole-house load sensor. The gap between it and the sum of your meters is drawn as a grey "Untracked" layer, line or slice, so power that no meter covers is visible instead of hidden. Use a load sensor, not grid import, when you have solar or a battery. You can also list the total as a meter to see its own row; that row keeps its sparkline, bar and value, but the total is left out of the chart and the shares so it is not counted twice.
- Screen readers announce each chart with a short description, for example "Power split, 3,844 W".
- Each meter row shows its share of the total next to its value, for example `1,240 W · 13%`, whenever a chart is shown.
- `color` on a meter sets its chart color. Without it, meters use Home Assistant's graph colors, so the chart matches your history graphs.
- `rows: false` shows only the chart, with a compact legend under it.
- The visual editor has a Chart multi-select, a Show rows toggle, a Total meter picker and a Color field per meter. It warns when you pick both Stacked and Lines, or when the meters use units that cannot be converted to each other.
- The stacked chart averages each time step instead of taking its peak, so the layers add up to the real load. The donut uses live values and works without history. Sparkline peaks are unchanged.
- In charts, shares and Untracked, `W`, `kW` and `MW` are converted to watts, so meters with different power units can share one chart.

## [0.1.6] - 2026-11-20

### Fixed

- In the visual editor, an open meter panel now stays with its meter when you move it up or down, delete another meter, or add a new one. Before, the open panel stayed at the same position, so after a move a different meter was suddenly open. This also works when you reorder meters in YAML and switch back to the editor.
- A Navigate or URL tap action you picked but have not filled in yet also stays with its meter, instead of being dropped or jumping to the meter that moved into its place.
- Values follow the Number format setting from your Home Assistant profile (for example `1,234.5`, `1.234,5`, `1 234,5`, or no thousands separator), the same way the built-in cards do. Before, the card used only your language and ignored that setting.

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

[0.3.0]: https://github.com/uded/constant-powermeter-card/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/uded/constant-powermeter-card/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/uded/constant-powermeter-card/compare/v0.1.6...v0.2.0
[0.1.6]: https://github.com/uded/constant-powermeter-card/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/uded/constant-powermeter-card/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/uded/constant-powermeter-card/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/uded/constant-powermeter-card/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/uded/constant-powermeter-card/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/uded/constant-powermeter-card/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/uded/constant-powermeter-card/releases/tag/v0.1.0
