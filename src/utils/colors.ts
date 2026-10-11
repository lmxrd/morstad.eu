// Shared pastel palette — the color base for the whole app.
// Used directly by tag chips (via tags.ts) and as the source for randomColor.
export const PALETTE = {
  blue: "#85b7eb",
  orange: "#f0997b",
  green: "#97c459",
  purple: "#afa9ec",
  pink: "#ed93b1",
  red: "#e57373",
  yellow: "#d4b85a",
  cyan: "#7ec8c8",
  teal: "#5eaba8",
  indigo: "#8b95d4",
} as const;

export type ColorName = keyof typeof PALETTE;

const COLOR_NAMES = Object.keys(PALETTE) as ColorName[];

export function randomColor(): string {
  return PALETTE[COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)]];
}

export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
