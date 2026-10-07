import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import type { ConstructionSide } from './constructionGeometry';

gsap.registerPlugin(MorphSVGPlugin);

export const MORPH_V2_FILL_DURATION = { left: 900, right: 880 } as const;
export const MORPH_V2_BRUSH_ADVANCE = 240;

type EdgeProfile = readonly [number, number, number, number, number, number, number];
interface EdgeState {
  left: EdgeProfile;
  right: EdgeProfile;
}

interface CapState {
  top: EdgeProfile;
  bottom: EdgeProfile;
}

const EDGE_ROWS = [80, 230, 380, 540, 700, 860, 1000] as const;
const HANDOFF_EDGE_ROWS = {
  left: EDGE_ROWS,
  right: [80, 230, 450, 560, 670, 860, 1000],
} as const;
const CAP_ROWS = {
  left: [230, 280, 330, 380, 430, 480, 545],
  right: [536, 586, 636, 686, 736, 786, 850],
} as const;

// These source-edge guides position temporary fronts only; the original artwork clips them.
const CAP_GUIDES = {
  left: {
    top: { x: 247, y: 344, slope: -247 / 279 },
    bottom: { x: 249, y: 982, slope: -248 / 280 },
  },
  right: {
    top: { x: 554, y: 96, slope: 249 / 280 },
    bottom: { x: 552, y: 735, slope: 247 / 282 },
  },
} as const;

// The side edges keep their extended seam while top/bottom fronts consume its ends.
const WETTING_EDGE_STATES: Record<ConstructionSide, readonly EdgeState[]> = {
  left: [
    { left: [229, 229, 229, 229, 229, 229, 229], right: [546, 546, 546, 546, 546, 546, 546] },
    { left: [246, 269, 284, 277, 273, 260, 244], right: [525, 510, 505, 514, 516, 506, 518] },
    { left: [325, 333, 334, 326, 336, 320, 303], right: [472, 462, 447, 460, 472, 454, 455] },
    { left: [368, 359, 348, 359, 370, 347, 326], right: [439, 426, 401, 426, 444, 425, 417] },
    { left: [407, 387, 361, 392, 395, 372, 358], right: [428, 408, 385, 392, 421, 402, 380] },
  ],
  right: [
    { left: [535, 535, 535, 535, 535, 535, 535], right: [851, 851, 851, 851, 851, 851, 851] },
    { left: [551, 564, 575, 566, 574, 590, 603], right: [835, 825, 806, 817, 806, 821, 835] },
    { left: [601, 620, 642, 632, 621, 645, 661], right: [760, 756, 769, 755, 743, 766, 778] },
    { left: [640, 659, 678, 664, 649, 674, 694], right: [717, 728, 747, 733, 717, 742, 757] },
    { left: [659, 678, 700, 683, 683, 688, 714], right: [680, 704, 724, 709, 683, 716, 735] },
  ],
};

const WETTING_CAP_STATES: Record<ConstructionSide, readonly CapState[]> = {
  left: [
    { top: [-18, -18, -18, -18, -18, -18, -18], bottom: [18, 18, 18, 18, 18, 18, 18] },
    { top: [55, 78, 42, 28, 66, 82, 57], bottom: [-51, -31, -60, -82, -43, -28, -57] },
    { top: [88, 110, 77, 62, 98, 122, 94], bottom: [-90, -61, -85, -112, -79, -58, -88] },
    { top: [118, 136, 105, 90, 127, 154, 124], bottom: [-120, -90, -114, -146, -108, -84, -121] },
    { top: [138, 152, 123, 108, 145, 173, 143], bottom: [-143, -110, -135, -167, -132, -104, -143] },
  ],
  right: [
    { top: [-18, -18, -18, -18, -18, -18, -18], bottom: [18, 18, 18, 18, 18, 18, 18] },
    { top: [64, 41, 30, 62, 88, 59, 45], bottom: [-43, -66, -88, -57, -34, -65, -82] },
    { top: [102, 78, 65, 97, 123, 96, 81], bottom: [-80, -104, -126, -95, -72, -101, -119] },
    { top: [131, 107, 92, 126, 156, 124, 110], bottom: [-110, -134, -159, -124, -98, -133, -149] },
    { top: [152, 127, 111, 147, 178, 144, 130], bottom: [-130, -155, -181, -145, -117, -154, -169] },
  ],
};

// Upper-left contact clears j1's trailing shoulder; the right waist clears a2's
// inward projection. The caps close the short ends before j2 and a1 arrive.
const HANDOFF_EDGE_STATES: Record<ConstructionSide, readonly EdgeState[]> = {
  left: [
    { left: [415, 395, 382, 381, 393, 380, 366], right: [424, 403, 382, 407, 416, 399, 382] },
    { left: [418, 400, 386, 396, 400, 389, 372], right: [416, 398, 378, 396, 408, 387, 370] },
    { left: [420, 402, 388, 399, 408, 391, 374], right: [414, 396, 376, 393, 400, 385, 368] },
    { left: [422, 404, 390, 401, 410, 393, 376], right: [412, 394, 374, 391, 398, 383, 366] },
  ],
  right: [
    { left: [668, 688, 711, 699, 678, 700, 722], right: [678, 700, 717, 699, 698, 711, 730] },
    { left: [672, 694, 718, 703, 684, 706, 726], right: [670, 690, 710, 695, 690, 704, 722] },
    { left: [674, 696, 720, 705, 689, 708, 728], right: [668, 688, 708, 693, 683, 702, 720] },
    { left: [676, 698, 722, 707, 691, 710, 730], right: [666, 686, 706, 691, 681, 700, 718] },
  ],
};

const HANDOFF_CAP_STATES: Record<ConstructionSide, readonly CapState[]> = {
  left: [
    { top: [152, 171, 156, 137, 165, 183, 159], bottom: [-158, -137, -160, -176, -148, -126, -157] },
    { top: [170, 193, 174, 150, 180, 204, 177], bottom: [-182, -158, -182, -200, -169, -149, -179] },
    { top: [184, 207, 188, 163, 194, 218, 191], bottom: [-195, -173, -197, -216, -184, -163, -194] },
    { top: [190, 213, 194, 169, 200, 224, 197], bottom: [-201, -179, -203, -222, -190, -169, -200] },
  ],
  right: [
    { top: [160, 146, 137, 170, 197, 160, 142], bottom: [-147, -170, -197, -161, -135, -171, -188] },
    { top: [181, 169, 158, 193, 220, 182, 165], bottom: [-169, -192, -222, -184, -158, -193, -210] },
    { top: [195, 182, 172, 207, 234, 196, 179], bottom: [-183, -206, -236, -198, -172, -207, -224] },
    { top: [201, 188, 178, 213, 240, 202, 185], bottom: [-189, -212, -242, -204, -178, -213, -230] },
  ],
};

function frontPath(
  profile: readonly number[],
  rows: readonly number[],
  outsideDepth: number,
  point: (along: number, depth: number) => string,
) {
  const commands = [`M ${point(rows[0], outsideDepth)} L ${point(rows[0], profile[0])}`];
  for (let index = 1; index < rows.length; index++) {
    const start = rows[index - 1];
    const end = rows[index];
    const third = (end - start) / 3;
    commands.push(`C ${point(start + third, profile[index - 1])} ${point(end - third, profile[index])} ${point(end, profile[index])}`);
  }
  commands.push(`L ${point(rows[rows.length - 1], outsideDepth)} Z`);
  return commands.join(' ');
}

// Endpoint slopes stay positive: resistance changes speed without a stop at each key.
function materialEase(entry: number, exit: number) {
  return (p: number) => (entry + exit - 2) * p ** 3 + (3 - 2 * entry - exit) * p ** 2 + entry * p;
}

const approachEase = materialEase(1.1, .85);
const handoffFraction = 80 / 220;
const handoffBlend = approachEase(handoffFraction);

export const MORPH_V2_SEGMENTS = [
  { duration: 150, ease: materialEase(1.35, .8) },
  { duration: 240, ease: materialEase(.85, .75) },
  { duration: 115, ease: materialEase(1.05, 1.25) },
  { duration: 80, ease: (p: number) => approachEase(p * handoffFraction) / handoffBlend },
  { duration: 70, ease: materialEase(1.05, .9) },
  { duration: 65, ease: materialEase(.95, 1.1) },
  { duration: 75, ease: materialEase(1.1, .8) },
  { duration: 105, ease: materialEase(.8, 1) },
] as const;

function handoffProfiles(wetting: readonly EdgeProfile[], late: readonly EdgeProfile[]) {
  // Split the old 505-725ms tween at 585ms with its exact eased position and
  // restricted easing. Changing a later target must not retime early/mid wetting.
  const boundary = wetting[3].map((value, index) =>
    value + (wetting[4][index] - value) * handoffBlend);
  return [...wetting.slice(0, 4), boundary, ...late];
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createMorphFillV2(
  mask: SVGMaskElement,
  contours: SVGGElement,
  stage: { side: ConstructionSide; fillStart: number; fillEnd: number; contourStart: number },
) {
  const maskX = Number.parseFloat(mask.getAttribute('x') ?? '');
  const maskWidth = Number.parseFloat(mask.getAttribute('width') ?? '');
  const maskHeight = Number.parseFloat(mask.getAttribute('height') ?? '');
  if (!Number.isFinite(maskX) || !Number.isFinite(maskWidth) || maskWidth <= 0 ||
      !Number.isFinite(maskHeight) || maskHeight <= 0) {
    throw new Error('The JA edge-contact fill requires valid canonical mask bounds.');
  }
  const fronts: SVGPathElement[] = [];
  const timeline = gsap.timeline({ paused: true });
  for (const direction of ['left', 'right', 'top', 'bottom'] as const) {
    let shapes: string[];
    if (direction === 'left' || direction === 'right') {
      const outsideX = direction === 'left' ? maskX - 4 : maskX + maskWidth + 4;
      shapes = handoffProfiles(
        WETTING_EDGE_STATES[stage.side].map(state => state[direction]),
        HANDOFF_EDGE_STATES[stage.side].map(state => state[direction]),
      ).map((profile, index) => frontPath(
        profile, index >= 5 ? HANDOFF_EDGE_ROWS[stage.side] : EDGE_ROWS,
        outsideX, (y, x) => `${x} ${y}`,
      ));
    } else {
      const guide = CAP_GUIDES[stage.side][direction];
      const outsideDepth = (direction === 'top' ? -1 : 1) * (maskHeight + 4);
      shapes = handoffProfiles(
        WETTING_CAP_STATES[stage.side].map(state => state[direction]),
        HANDOFF_CAP_STATES[stage.side].map(state => state[direction]),
      ).map(profile => frontPath(
        profile, CAP_ROWS[stage.side], outsideDepth,
        (x, depth) => `${x} ${guide.y + (x - guide.x) * guide.slope + depth}`,
      ));
    }
    const front = document.createElementNS(SVG_NS, 'path');
    front.setAttribute('data-ja-fill-front', `${stage.side}-${direction}`);
    front.setAttribute('data-ja-morph-version', '2');
    front.setAttribute('fill', 'white');
    front.setAttribute('d', shapes[0]);
    mask.append(front);
    fronts.push(front);
    let position = 0;
    MORPH_V2_SEGMENTS.forEach((segment, index) => {
      timeline.fromTo(front, {
        morphSVG: { shape: shapes[index], shapeIndex: 0, type: 'linear' },
      }, {
        morphSVG: { shape: shapes[index + 1], shapeIndex: 0, type: 'linear' },
        duration: segment.duration / 1000,
        ease: segment.ease,
        immediateRender: false,
      }, position);
      position += segment.duration / 1000;
    });
  }

  return {
    sync(time: number, reducedMotion: boolean) {
      const complete = reducedMotion || time >= stage.fillEnd;
      const progress = Math.max(0, Math.min(1, (time - stage.fillStart) / (stage.fillEnd - stage.fillStart)));
      if (!reducedMotion) timeline.progress(progress, true);
      for (const front of fronts) front.style.display = complete ? 'none' : '';
      contours.style.display = reducedMotion || time < stage.contourStart || complete ? 'none' : '';
    },
    destroy() {
      timeline.kill();
    },
  };
}
