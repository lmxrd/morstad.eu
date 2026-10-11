import { randomColor, withAlpha } from "./colors";

type TagShades = { text: string; bg: string; border: string };

const tagColorCache = new Map<string, TagShades>();

export function getTagColor(name: string): TagShades {
  let colors = tagColorCache.get(name);
  if (!colors) {
    const text = randomColor();
    colors = { text, bg: withAlpha(text, 0.15), border: withAlpha(text, 0.3) };
    tagColorCache.set(name, colors);
  }
  return colors;
}
