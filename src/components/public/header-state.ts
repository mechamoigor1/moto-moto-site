export const COMPACT_SCROLL_Y = 48;

export function getMobileHeaderState(scrollY: number): "expanded" | "compact" {
  return scrollY < COMPACT_SCROLL_Y ? "expanded" : "compact";
}
