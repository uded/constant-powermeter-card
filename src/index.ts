import { ConstantPowermeterCard } from './card';

const TAG = 'constant-powermeter-card';

if (!customElements.get(TAG)) customElements.define(TAG, ConstantPowermeterCard);

interface CustomCardEntry {
  type: string;
  name: string;
  preview: boolean;
  description: string;
}

const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards ??= [];
if (!w.customCards.some((c) => c.type === TAG)) {
  w.customCards.push({
    type: TAG,
    name: 'Constant Powermeter Card',
    preview: true,
    description: 'Power meters with per-meter thresholds, a sparkline and a bar.',
  });
}
