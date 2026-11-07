export type ConstructionSide = 'left' | 'right';

interface Point {
  x: number;
  y: number;
}

export interface OuterConstruction {
  contact: Point;
  contactDistance: number;
  perimeter: number;
  forwardLength: number;
  backwardLength: number;
  forwardRailLength: number;
  backwardRailLength: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

export function getOuterConstruction(pathData: string, side: ConstructionSide, contactY = 540): OuterConstruction {
  // The two master outer paths are absolute M/L/Z polygons. Reject other commands rather than approximate them.
  const tokens = pathData.match(/[MLZ]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi);
  if (!tokens || pathData.replace(/[MLZ]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?|[\s,]/gi, '') !== '') {
    throw new Error('The JA outer contour must be an absolute M/L/Z polygon.');
  }
  const points: Point[] = [];
  let index = 0;
  while (index < tokens.length - 1) {
    const command = tokens[index++];
    const x = Number(tokens[index++]);
    const y = Number(tokens[index++]);
    if (command !== (points.length ? 'L' : 'M') || !Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error('The canonical JA outer contour contains an unsupported segment.');
    }
    points.push({ x, y });
  }
  if (tokens[index] !== 'Z' || index !== tokens.length - 1 || points.length < 3) {
    throw new Error('The canonical JA outer contour must be closed.');
  }

  let perimeter = 0;
  const winding = Math.sign(points.reduce((area, point, i) => {
    const next = points[(i + 1) % points.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0));
  if (!winding) throw new Error('The canonical JA outer contour must enclose an area.');
  const intersections: Array<{ point: Point; distance: number; forwardRail: number; backwardRail: number }> = [];
  points.forEach((start, pointIndex) => {
    const end = points[(pointIndex + 1) % points.length];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    if (!length) throw new Error('The canonical JA outer contour contains an empty edge.');
    if (contactY > Math.min(start.y, end.y) && contactY < Math.max(start.y, end.y)) {
      const ratio = (contactY - start.y) / (end.y - start.y);
      intersections.push({
        point: { x: start.x + ratio * (end.x - start.x), y: contactY },
        distance: perimeter + ratio * length,
        forwardRail: (1 - ratio) * length,
        backwardRail: ratio * length,
      });
    }
    perimeter += length;
  });
  intersections.sort((a, b) => a.point.x - b.point.x);
  if (intersections.length !== 2) {
    throw new Error('The JA contact row must cross exactly two canonical outer edges.');
  }
  const [contact, opposite] = side === 'left' ? intersections : [...intersections].reverse();
  const forwardLength = (opposite.distance - contact.distance + perimeter) % perimeter;
  return {
    contact: contact.point,
    contactDistance: contact.distance,
    perimeter,
    forwardLength,
    backwardLength: perimeter - forwardLength,
    forwardRailLength: contact.forwardRail,
    backwardRailLength: contact.backwardRail,
    bounds: {
      minX: Math.min(...points.map(point => point.x)),
      minY: Math.min(...points.map(point => point.y)),
      maxX: Math.max(...points.map(point => point.x)),
      maxY: Math.max(...points.map(point => point.y)),
    },
  };
}

export const CONTOUR_EASING_POINTS = [.22, .30, .48, 1] as const;

export function getSaturationStrokeWidth(construction: OuterConstruction, progress: number) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) {
    throw new RangeError('JA saturation progress must be between zero and one.');
  }
  // A stroke wider than the full horizontal span closes the core without transforming the source silhouette.
  return (construction.bounds.maxX - construction.bounds.minX + 4) * progress;
}
