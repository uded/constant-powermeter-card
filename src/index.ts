import { version } from '../package.json';
import { ConstantPowermeterCard } from './card';
import { ConstantPowermeterCardEditor } from './editor';

const TAG = 'constant-powermeter-card';
const EDITOR_TAG = `${TAG}-editor`;

console.info(`${TAG} v${version}`);

if (!customElements.get(TAG)) customElements.define(TAG, ConstantPowermeterCard);
if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, ConstantPowermeterCardEditor);
}

interface CustomCardEntry {
  type: string;
  name: string;
  preview: boolean;
  description: string;
  documentationURL?: string;
}

const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards ??= [];
if (!w.customCards.some((c) => c.type === TAG)) {
  w.customCards.push({
    type: TAG,
    name: 'Constant Powermeter Card',
    preview: true,
    description: 'Power meters with per-meter thresholds, a sparkline and a bar.',
    documentationURL: 'https://github.com/uded/constant-powermeter-card',
  });
}
