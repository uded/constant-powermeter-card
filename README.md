# Constant Powermeter Card

A Home Assistant Lovelace card that shows several power meters in one panel. Each meter has its own thresholds, a live value, and a sparkline, a bar, or both. It uses `ha-card` and your theme variables, so it looks like the built-in cards in any light or dark theme.

```
Kitchen      ▁▂▃▅▇▆▄▃▄▅▆      1 240 W
████████████████░░░░░░░░░░░░░░░░░░░░

Grid                         -1 200 W
░░░░░▓▓▓▓|░░░░░░░░░░░░░░░░░░░░
```

Features:

- Several meters per card, each with its own `min`, `max`, thresholds, name and unit.
- Sparkline and bar, chosen per panel or per meter. The sparkline is colored by level along the line.
- Level colors are set once per panel and shared by every meter.
- Two-sided meters for values that go negative (grid, solar, battery).
- Click a meter to open its more-info dialog, or navigate, or open a URL.
- A visual editor for everything, including the thresholds of each meter. YAML is optional.
- One history subscription per card, not one per meter.

## Installation

### HACS (custom repository)

1. In Home Assistant, open HACS and choose the three-dot menu, then **Custom repositories**.
2. Add `https://github.com/uded/constant-powermeter-card` with the category **Dashboard** (called **Lovelace** in older HACS versions).
3. Find **Constant Powermeter Card** in HACS and install it.
4. Reload the browser. HACS registers the resource for you.

### Manual

1. Download `constant-powermeter-card.js` from the `dist/` folder (or a release) and copy it to `<config>/www/`.
2. Go to **Settings, Dashboards, three-dot menu, Resources** and add `/local/constant-powermeter-card.js` as a **JavaScript module**.
3. Reload the browser.

## Usage

Add the card from the card picker (search for "Constant Powermeter") and use the visual editor, or write YAML.

### Full example

Every option, with its default where there is one:

```yaml
type: custom:constant-powermeter-card
title: Per-room power # optional
display: [sparkline, bar] # panel default; one or both
hours: 1 # sparkline window, 0.25 to 24, default 1
sparkline_scale: fixed # fixed (min..max) | auto (data min..max)
colors: # shared by every meter in the panel
  normal: var(--success-color) # default
  warning: var(--warning-color)
  critical: var(--error-color)
blend: true # interpolate between levels; false = step
meters:
  - entity: sensor.kitchen_power
    name: Kitchen # default: friendly_name
    unit: W # default: unit_of_measurement, else none
    precision: 0 # default: entity display precision, else 0
    min: 0 # default 0
    max: 3500 # default 5000
    normal: 500 # default min + 20% of range
    warning: 2000 # default min + 60% of range
    critical: 3000 # default max
    display: [bar] # optional override of the panel default
    tap_action:
      action: more-info # default
  - entity: sensor.grid_power
    name: Grid
    min: -3000 # min below 0 makes the meter two-sided
    max: 7000
    normal: 1000 # thresholds apply to the absolute value
    warning: 3000
    critical: 5000
    tap_action:
      action: navigate
      navigation_path: /energy
  - sensor.office_power # bare entity id: all defaults
```

### Options

Panel options:

| Option            | Default                | Description                                                       |
| ----------------- | ---------------------- | ----------------------------------------------------------------- |
| `title`           | none                   | Optional header above the rows.                                   |
| `display`         | `[sparkline, bar]`     | One or both of `sparkline` and `bar`. Unknown values are ignored. |
| `hours`           | `1`                    | Sparkline window in hours, 0.25 to 24.                            |
| `sparkline_scale` | `fixed`                | `fixed` uses the meter's `min..max`, `auto` uses the data range.  |
| `colors.normal`   | `var(--success-color)` | Any CSS color: named, hex, `rgb()`, `hsl()` or `var()`.           |
| `colors.warning`  | `var(--warning-color)` |                                                                   |
| `colors.critical` | `var(--error-color)`   |                                                                   |
| `blend`           | `true`                 | Blend between level colors. `false` switches colors in steps.     |
| `meters`          | required               | At least one entry. Each is an entity id or an object.            |

Meter options:

| Option       | Default                          | Description                                             |
| ------------ | -------------------------------- | ------------------------------------------------------- |
| `entity`     | required                         | Entity id.                                              |
| `name`       | `friendly_name`                  | Row label. Long names are cut with an ellipsis.         |
| `unit`       | `unit_of_measurement`, else none | Display label only. There is no W/kW conversion.        |
| `precision`  | entity display precision, else 0 | Decimals shown.                                         |
| `min`        | `0`                              | Bottom of the scale. Below 0 makes the meter two-sided. |
| `max`        | `5000`                           | Top of the scale.                                       |
| `normal`     | `min` + 20% of the range         | Up to this value the normal color is used.              |
| `warning`    | `min` + 60% of the range         | Warning color is reached here.                          |
| `critical`   | `max`                            | From here the critical color is used.                   |
| `display`    | panel `display`                  | Override the panel default for this meter.              |
| `tap_action` | `more-info`                      | What a click does. See below.                           |

Notes:

- Thresholds must satisfy `normal <= warning <= critical`. A config that breaks this still renders, the values are sorted, and the editor shows an error on that meter.
- Derived threshold defaults are not written into the config, so they follow `min` and `max` when those change. A derived default never passes a threshold you set: with only `critical: 2500` on a 0 to 5000 meter, `warning` becomes 2500 instead of 3000.
- Values are used exactly as the entity reports them. Thresholds, history and the bar all use the same unit.
- A state that is `unavailable`, `unknown`, empty or not a number shows `—`, hides the bar fill, and leaves a gap in the sparkline.

### How level colors work

The level comes from the meter's own thresholds. At or below `normal` the normal color is used. At or above `critical` the critical color is used. In between, the color is a blend of the two neighbouring levels when `blend: true`, or the lower level's color when `blend: false`. The value text keeps the theme's primary text color so it stays readable. Only the bar fill and the sparkline use the level color.

The three colors accept any CSS color: a name (`blue`), hex (`#43a047`), `rgb()`, `hsl()`, or a theme variable such as `var(--success-color)`, with or without an inline fallback (`var(--my-color, #abc)`). A value the browser cannot read as a color uses the level's built-in default.

### Two-sided meters

Some meters go below zero, such as grid export, battery discharge or a solar inverter's night draw. There is no extra option: a meter is two-sided when its `min` is below 0. Meters with `min >= 0` behave as plain consumption meters.

```yaml
- entity: sensor.grid_power
  name: Grid
  min: -3000
  max: 7000 # zero sits at 30% of the track
  normal: 1000
  warning: 3000
  critical: 5000
```

On a two-sided meter:

- The bar fill starts at the zero point and grows toward the value. A thin tick marks zero.
- The sparkline draws a faint zero line, and the area fill runs from the line to zero. With `sparkline_scale: auto` the range always includes zero.
- Thresholds apply to the absolute value, so 3 kW of export is as "hot" as 3 kW of import. Thresholds must be `>= 0`. The editor marks a negative threshold as an error.
- Each sparkline bucket plots the sample with the largest absolute value, so a short export spike is as visible as an import spike.
- Threshold defaults are derived from `max(|min|, max)` instead of the range.

### Click on a meter

Clicking a meter row opens the more-info dialog for its entity (history, attributes, settings), the same dialog the built-in entity cards open. Set `tap_action` on a meter to change that:

```yaml
tap_action:
  action: more-info # default
  # action: navigate
  # navigation_path: /energy
  # action: url
  # url_path: https://example.com
  # action: none
```

| Action      | Extra field       | Effect                                     |
| ----------- | ----------------- | ------------------------------------------ |
| `more-info` | none              | Opens the more-info dialog for the entity. |
| `navigate`  | `navigation_path` | Navigates to a dashboard path.             |
| `url`       | `url_path`        | Opens a URL.                               |
| `none`      | none              | Does nothing. The row is not focusable.    |

Rows are keyboard accessible: they have `role="button"` and `tabindex="0"`, and Enter or Space trigger the action. `perform-action`, `hold_action` and `double_tap_action` are not supported yet. In the editor preview, clicks do nothing, so you do not open dialogs while editing.

### Visual editor

Everything above can be set in the editor, with no YAML needed:

- **Panel:** title, display (sparkline and bar), window in hours, sparkline scale, the three level colors, and the blend toggle.
- **Meters:** one expandable section per meter, with entity, name, unit, precision, min, max, the three thresholds, display override and a tap action (More info, Navigate, URL, None). Navigate and URL show a path field.
- **Threshold preview strip:** a thin bar from `min` to `max` (from 0 to `max(|min|, max)` on a two-sided meter, since its thresholds apply to the absolute value) painted with the three level bands in the panel colors. It updates as you type, so a wrong value is visible before saving.
- **Validation:** thresholds that break `normal <= warning <= critical`, or a negative threshold on a two-sided meter, are marked with a short message.
- **Reordering:** move meters with the up and down buttons, delete with the bin, add with **Add meter**.
- Picking an entity fills the name and unit placeholders from its attributes. Bare entity-id entries are expanded to objects when edited in the UI.

## Development

Requirements: Node.js and [go-task](https://taskfile.dev).

```sh
npm ci          # install dependencies
task check      # eslint, prettier, tsc and vitest
task build      # build dist/constant-powermeter-card.js
task dev        # watch build and serve the dev harness at http://localhost:5173/dev/index.html
```

The dev harness in `dev/index.html` runs the built card against a mock `hass` and a mock `connection`. It replays an hour of fake history, pushes a new value every 5 seconds, and has a light and dark toggle. It needs no Home Assistant instance.

`dist/constant-powermeter-card.js` is committed, because HACS installs it straight from the repository. CI fails if the committed bundle is out of date, so run `task build` and commit `dist/` with your change.

## Credits

Inspired by the linear bar card of [Lirum-Labs/ha-power-gauge](https://github.com/Lirum-Labs/ha-power-gauge). This card is a fresh rewrite and does not contain code from that project.
