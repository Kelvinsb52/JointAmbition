export function getWingPath(
  points: number[][],
  edges: number[][],
  hinge: number[],
  phase: number,
  strength?: number,
): string;

export function attachHummingbirdMotion(
  element: HTMLElement,
  options?: { cyclesPerSecond?: number },
): {
  play: (duration?: number) => void;
  destroy: () => void;
};
