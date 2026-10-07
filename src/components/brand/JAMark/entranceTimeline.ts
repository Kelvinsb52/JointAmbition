import { type MarkGroup, verifyCanonicalGeometry } from './canonicalArtwork';
import {
  CONTOUR_EASING_POINTS, getOuterConstruction, getSaturationStrokeWidth, type ConstructionSide,
} from './constructionGeometry';
import { createMorphFill, type EntranceFillMode } from './morphFill';
import { createMorphFillV2, MORPH_V2_BRUSH_ADVANCE, MORPH_V2_FILL_DURATION } from './morphFillV2';

export const LINE_STAGES = [
  { side: 'left', start: 240, end: 1320, retractEnd: 2040, easing: 'cubic-bezier(.55,.02,.85,.65)' },
  { side: 'right', start: 310, end: 1410, retractEnd: 2160, easing: 'cubic-bezier(.50,0,.82,.68)' },
] as const;

export const OUTER_STAGES = ([
  { side: 'left', group: 'pgl', contourStart: 1320, contourEnd: 2340, saturationAt: .84 },
  { side: 'right', group: 'pgr', contourStart: 1410, contourEnd: 2460, saturationAt: .778 },
] as const).map(stage => {
  // Local construction sets a 50 ms stagger; the right fill then gently catches up.
  const fillStart = stage.contourStart + (stage.contourEnd - stage.contourStart) * stage.saturationAt;
  return { ...stage, fillStart, fillEnd: fillStart + (stage.side === 'left' ? 1150 : 1120) };
});

export const CONTOUR_EASING = `cubic-bezier(${CONTOUR_EASING_POINTS.join(',')})`;
export const RETRACTION_EASING = 'cubic-bezier(.32,0,.58,1)';
export const SATURATION_EASING = 'cubic-bezier(.25,.12,.65,.85)';
const BRUSH_EASING = 'cubic-bezier(.30,.18,.65,.90)';
const BRUSH_STAGES: ReadonlyArray<{
  group: Exclude<MarkGroup, 'pgl' | 'pgr'>;
  from: 'left' | 'right' | 'top' | 'bottom';
  start: number;
  end: number;
  tilt: number;
}> = [
  { group: 'j1', from: 'left', start: 2680, end: 2980, tilt: 0 },
  { group: 'j3', from: 'top', start: 2930, end: 3360, tilt: 0 },
  { group: 'j2', from: 'right', start: 3310, end: 3580, tilt: 0 },
  { group: 'j4', from: 'bottom', start: 3530, end: 3880, tilt: 0 },
  // Lead from each A stem toward its short inward projections, keeping those projections connected.
  { group: 'a2', from: 'top', start: 2820, end: 3330, tilt: -.6 },
  { group: 'a1', from: 'bottom', start: 3280, end: 3770, tilt: .9 },
];

export const ENTRANCE_DURATION = Math.max(
  ...OUTER_STAGES.map(stage => stage.fillEnd),
  ...BRUSH_STAGES.map(stage => stage.end),
) + 180;

export interface EntranceState {
  time: number;
  playing: boolean;
  reducedMotion: boolean;
}

export interface EntranceControls {
  play: () => void;
  pause: () => void;
  replay: () => void;
  seek: (time: number) => void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function smoothstep(progress: number) {
  const value = Math.max(0, Math.min(1, progress));
  return value * value * (3 - 2 * value);
}

function createAttractorMap(side: ConstructionSide, anchor: 0 | 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('The JA wetting influence map could not be created.');
  const image = context.createImageData(canvas.width, canvas.height);
  const centers = side === 'left'
    ? [[.43, .39], [.58, .65]] as const
    : [[.56, .35], [.45, .62]] as const;
  const [centerX, centerY] = centers[anchor];
  // An invisible, smooth vector field. SVG reverse sampling pulls coverage toward its interior center.
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = ((x + .5) / canvas.width - centerX) / .4;
      const dy = ((y + .5) / canvas.height - centerY) / .29;
      const falloff = 1.6 * Math.exp(-(dx * dx + dy * dy) / 2);
      const index = (y * canvas.width + x) * 4;
      image.data[index] = Math.round(127.5 * (1 + dx * falloff));
      image.data[index + 1] = Math.round(127.5 * (1 + dy * falloff));
      image.data[index + 2] = 128;
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export function createEntranceTimeline(
  composition: SVGSVGElement,
  artwork: SVGSVGElement,
  masks: SVGDefsElement,
  prefix: string,
  onUpdate: (state: EntranceState) => void,
  fillMode: EntranceFillMode = 'current',
) {
  const isMorphV2 = fillMode === 'morph-v2';
  const outerStages = isMorphV2
    ? OUTER_STAGES.map(stage => ({ ...stage, fillEnd: stage.fillStart + MORPH_V2_FILL_DURATION[stage.side] }))
    : OUTER_STAGES;
  const brushStages = isMorphV2
    ? BRUSH_STAGES.map(stage => ({
      ...stage, start: stage.start - MORPH_V2_BRUSH_ADVANCE, end: stage.end - MORPH_V2_BRUSH_ADVANCE,
    }))
    : BRUSH_STAGES;
  const animations: Animation[] = [];
  const morphFills: ReturnType<typeof createMorphFill>[] = [];
  const maskedElements: Array<{ element: SVGGraphicsElement; maskId: string; end: number | null }> = [];
  const guideWindows: Array<{ rect: SVGRectElement; width: number; end: number }> = [];
  const outerFills: Array<{
    boundary: SVGPathElement;
    materialBlend: SVGFECompositeElement;
    attractorDrifts: SVGFEOffsetElement[];
    attractionBlend: SVGFECompositeElement;
    torsion: SVGFEColorMatrixElement;
    wettingBlend: SVGFECompositeElement;
    displacement: SVGFEDisplacementMapElement;
    contours: SVGGElement;
    side: ConstructionSide;
    maxDepth: number;
    start: number;
    end: number;
    contourStart: number;
  }> = [];
  const constructionLayer = document.createElementNS(SVG_NS, 'g');
  constructionLayer.setAttribute('class', 'ja-entrance__construction');
  const artworkHost = artwork.parentNode;
  if (!(artworkHost instanceof SVGGElement) || artworkHost.parentNode !== composition) {
    throw new Error('The JA construction layer requires the canonical artwork host.');
  }
  artworkHost.after(constructionLayer);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = false;
  let frame = 0;
  let destroyed = false;
  let lastReportedTime = -Infinity;

  function animate(element: SVGElement, keyframes: Keyframe[]) {
    const animation = element.animate(keyframes, {
      duration: ENTRANCE_DURATION,
      fill: 'both',
      easing: 'linear',
    });
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
  }

  function reveal(
    element: SVGGraphicsElement,
    id: string,
    from: 'left' | 'right' | 'top' | 'bottom',
    start: number,
    end: number,
    easing: string,
    retractEnd?: number,
    bounds: DOMRect = element.getBBox(),
  ) {
    const mask = document.createElementNS(SVG_NS, 'mask');
    const rect = document.createElementNS(SVG_NS, 'rect');
    const maskId = `${prefix}-reveal-${id}`;
    const width = bounds.width + (retractEnd ? 0 : 4);
    const height = bounds.height + (retractEnd ? 16 : 4);
    mask.id = maskId;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    for (const element of [mask, rect]) {
      element.setAttribute('x', String(bounds.x - (retractEnd ? 0 : 2)));
      element.setAttribute('y', String(bounds.y - (retractEnd ? 8 : 2)));
      element.setAttribute('width', String(width));
      element.setAttribute('height', String(height));
    }
    rect.setAttribute('fill', 'white');
    rect.setAttribute('data-ja-reveal', id);
    mask.append(rect);
    masks.append(mask);
    maskedElements.push({ element, maskId, end: retractEnd ? null : end });
    if (retractEnd) guideWindows.push({ rect, width, end: retractEnd });

    const x = from === 'right' ? width : from === 'left' ? -width : 0;
    const y = from === 'bottom' ? height : from === 'top' ? -height : 0;
    const hidden = `translate(${x}px, ${y}px)`;
    const keyframes: Keyframe[] = [
      { offset: 0, transform: hidden },
      { offset: start / ENTRANCE_DURATION, transform: hidden, easing },
      { offset: end / ENTRANCE_DURATION, transform: 'translate(0px, 0px)', easing: RETRACTION_EASING },
    ];
    const consumed = retractEnd ? `translate(${-x}px, ${-y}px)` : 'translate(0px, 0px)';
    if (retractEnd) keyframes.push({ offset: retractEnd / ENTRANCE_DURATION, transform: consumed });
    keyframes.push({ offset: 1, transform: consumed });
    animate(rect, keyframes);
    return rect;
  }

  for (const stage of LINE_STAGES) {
    const line = composition.querySelector(`[data-ja-line="${stage.side}"]`);
    if (!(line instanceof SVGPathElement)) throw new Error(`Missing JA ${stage.side} line.`);
    const outerStage = OUTER_STAGES.find(outer => outer.side === stage.side);
    const source = artwork.querySelector(`[data-ja-source-id="${outerStage?.group}"] > path`);
    if (!(source instanceof SVGPathElement)) throw new Error(`Missing JA ${stage.side} outer geometry.`);
    const { contact } = getOuterConstruction(source.getAttribute('d') ?? '', stage.side);
    line.setAttribute('d', `M ${stage.side === 'left' ? -330 : 1410} ${contact.y} H ${contact.x}`);
    reveal(line, `line-${stage.side}`, stage.side, stage.start, stage.end, stage.easing, stage.retractEnd);
  }

  for (const stage of outerStages) {
    const group = artwork.querySelector(`[data-ja-source-id="${stage.group}"]`);
    const source = group?.querySelector('path');
    if (!(group instanceof SVGGElement) || !(source instanceof SVGPathElement)) {
      throw new Error(`Missing canonical outer group ${stage.group}.`);
    }
    const pathData = source.getAttribute('d') ?? '';
    const construction = getOuterConstruction(pathData, stage.side);
    const { bounds, perimeter, contactDistance } = construction;
    const mask = document.createElementNS(SVG_NS, 'mask');
    mask.id = `${prefix}-ink-${stage.side}`;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('mask-type', 'luminance');
    mask.setAttribute('x', String(bounds.minX - 16));
    mask.setAttribute('y', String(bounds.minY - 16));
    mask.setAttribute('width', String(bounds.maxX - bounds.minX + 32));
    mask.setAttribute('height', String(bounds.maxY - bounds.minY + 32));
    masks.append(mask);
    maskedElements.push({ element: group, maskId: mask.id, end: stage.fillEnd });

    const clip = document.createElementNS(SVG_NS, 'clipPath');
    clip.id = `${prefix}-contour-clip-${stage.side}`;
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const silhouette = document.createElementNS(SVG_NS, 'use');
    silhouette.setAttribute('href', `#${source.id}`);
    clip.append(silhouette);
    masks.append(clip);
    const contours = document.createElementNS(SVG_NS, 'g');
    contours.setAttribute('clip-path', `url(#${clip.id})`);
    contours.setAttribute('data-ja-contours', stage.side);
    constructionLayer.append(contours);

    for (const direction of ['forward', 'backward'] as const) {
      const contour = document.createElementNS(SVG_NS, 'path');
      contour.setAttribute('d', pathData);
      contour.setAttribute('data-ja-contour-source', stage.group);
      contour.setAttribute('fill', 'none');
      contour.setAttribute('stroke', 'currentColor');
      const drawMask = document.createElementNS(SVG_NS, 'mask');
      drawMask.id = `${prefix}-contour-${stage.side}-${direction}`;
      drawMask.setAttribute('maskUnits', 'userSpaceOnUse');
      drawMask.setAttribute('maskContentUnits', 'userSpaceOnUse');
      for (const attribute of ['x', 'y', 'width', 'height']) {
        drawMask.setAttribute(attribute, mask.getAttribute(attribute)!);
      }
      const tracer = document.createElementNS(SVG_NS, 'path');
      tracer.setAttribute('d', pathData);
      tracer.setAttribute('fill', 'none');
      tracer.setAttribute('stroke', 'white');
      tracer.setAttribute('stroke-width', '24');
      tracer.setAttribute('stroke-linecap', 'butt');
      tracer.setAttribute('data-ja-trace', `${stage.side}-${direction}`);
      drawMask.append(tracer);
      masks.append(drawMask);
      contour.setAttribute('mask', `url(#${drawMask.id})`);
      contours.append(contour);
      const length = direction === 'forward' ? construction.forwardLength : construction.backwardLength;
      const initial = { strokeDasharray: `0 ${perimeter}`, strokeDashoffset: String(-contactDistance) };
      const final = {
        strokeDasharray: `${length} ${perimeter - length}`,
        strokeDashoffset: String((direction === 'backward' ? length : 0) - contactDistance),
      };
      // Dash only an exact source-path copy inside the mask; the visible stroke never leaves the source silhouette.
      animate(tracer, [
        { offset: 0, ...initial },
        { offset: stage.contourStart / ENTRANCE_DURATION, ...initial, easing: CONTOUR_EASING },
        { offset: stage.contourEnd / ENTRANCE_DURATION, ...final },
        { offset: 1, ...final },
      ]);
    }
    if (fillMode === 'morph' || isMorphV2) {
      morphFills.push(isMorphV2 ? createMorphFillV2(mask, contours, stage) : createMorphFill(mask, contours, stage));
      continue;
    }

    const boundary = document.createElementNS(SVG_NS, 'path');
    boundary.setAttribute('data-ja-saturation', stage.side);
    boundary.setAttribute('d', pathData);
    boundary.setAttribute('fill', 'none');
    boundary.setAttribute('stroke', 'white');
    boundary.setAttribute('stroke-linejoin', 'miter');
    boundary.setAttribute('stroke-width', '0');
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.id = `${prefix}-wetting-${stage.side}`;
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    for (const attribute of ['x', 'y', 'width', 'height']) {
      filter.setAttribute(attribute, mask.getAttribute(attribute)!);
    }
    // Blend material samples, never separate coverage masks or independently advancing fronts.
    for (const sample of [0, 1]) {
      const grain = document.createElementNS(SVG_NS, 'feTurbulence');
      grain.setAttribute('type', 'fractalNoise');
      grain.setAttribute('baseFrequency', '.0018 .0026');
      grain.setAttribute('numOctaves', '1');
      grain.setAttribute('seed', String((stage.side === 'left' ? 11 : 17) + sample * 26));
      grain.setAttribute('result', `grain-${sample}`);
      const contrast = document.createElementNS(SVG_NS, 'feComponentTransfer');
      contrast.setAttribute('in', `grain-${sample}`);
      contrast.setAttribute('result', `material-${sample}`);
      for (const channel of ['feFuncR', 'feFuncG'] as const) {
        const transfer = document.createElementNS(SVG_NS, channel);
        transfer.setAttribute('type', 'linear');
        transfer.setAttribute('slope', '3');
        transfer.setAttribute('intercept', '-1');
        contrast.append(transfer);
      }
      const alpha = document.createElementNS(SVG_NS, 'feFuncA');
      alpha.setAttribute('type', 'table');
      alpha.setAttribute('tableValues', '1 1');
      contrast.append(alpha);
      filter.append(grain, contrast);
    }
    const materialBlend = document.createElementNS(SVG_NS, 'feComposite');
    materialBlend.setAttribute('in', 'material-0');
    materialBlend.setAttribute('in2', 'material-1');
    materialBlend.setAttribute('operator', 'arithmetic');
    materialBlend.setAttribute('k2', '1');
    materialBlend.setAttribute('k3', '0');
    materialBlend.setAttribute('result', 'material');
    filter.append(materialBlend);
    const attractorDrifts: SVGFEOffsetElement[] = [];
    for (const anchor of [0, 1] as const) {
      const attractor = document.createElementNS(SVG_NS, 'feImage');
      attractor.setAttribute('href', createAttractorMap(stage.side, anchor));
      attractor.setAttribute('preserveAspectRatio', 'none');
      attractor.setAttribute('data-ja-attractor', `${stage.side}-${anchor + 1}`);
      attractor.setAttribute('result', `attractor-${anchor}`);
      for (const attribute of ['x', 'y', 'width', 'height']) {
        attractor.setAttribute(attribute, mask.getAttribute(attribute)!);
      }
      const drift = document.createElementNS(SVG_NS, 'feOffset');
      drift.setAttribute('in', `attractor-${anchor}`);
      drift.setAttribute('result', `moving-attractor-${anchor}`);
      filter.append(attractor, drift);
      attractorDrifts.push(drift);
    }
    const attractionBlend = document.createElementNS(SVG_NS, 'feComposite');
    attractionBlend.setAttribute('in', 'moving-attractor-0');
    attractionBlend.setAttribute('in2', 'moving-attractor-1');
    attractionBlend.setAttribute('operator', 'arithmetic');
    attractionBlend.setAttribute('k2', '.5');
    attractionBlend.setAttribute('k3', '.5');
    attractionBlend.setAttribute('result', 'moving-attractors');
    const torsion = document.createElementNS(SVG_NS, 'feColorMatrix');
    torsion.setAttribute('in', 'moving-attractors');
    torsion.setAttribute('type', 'matrix');
    torsion.setAttribute('result', 'biased-attractor');
    const wettingBlend = document.createElementNS(SVG_NS, 'feComposite');
    wettingBlend.setAttribute('in', 'material');
    wettingBlend.setAttribute('in2', 'biased-attractor');
    wettingBlend.setAttribute('operator', 'arithmetic');
    wettingBlend.setAttribute('k2', '1');
    wettingBlend.setAttribute('k3', '0');
    wettingBlend.setAttribute('result', 'wetting');
    const displacement = document.createElementNS(SVG_NS, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'wetting');
    displacement.setAttribute('scale', '0');
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');
    filter.append(attractionBlend, torsion, wettingBlend, displacement);
    masks.append(filter);
    boundary.setAttribute('filter', `url(#${filter.id})`);
    const finalWidth = getSaturationStrokeWidth(construction, 1);
    const width = String(finalWidth);
    animate(boundary, [
      { offset: 0, strokeWidth: '0' },
      { offset: stage.fillStart / ENTRANCE_DURATION, strokeWidth: '0', easing: SATURATION_EASING },
      { offset: stage.fillEnd / ENTRANCE_DURATION, strokeWidth: width },
      { offset: 1, strokeWidth: width },
    ]);
    mask.append(boundary);
    outerFills.push({
      boundary, materialBlend, attractorDrifts, attractionBlend, torsion, wettingBlend, displacement, contours,
      side: stage.side, maxDepth: finalWidth / 2,
      start: stage.fillStart, end: stage.fillEnd, contourStart: stage.contourStart,
    });
  }

  for (const stage of brushStages) {
    const group = artwork.querySelector(`[data-ja-source-id="${stage.group}"]`);
    if (!(group instanceof SVGGElement)) throw new Error(`Missing canonical JA group ${stage.group}.`);
    // Bounds and masks stay in the group's own coordinate system, including the translated j2.
    const bounds = group.getBBox();
    const horizontal = stage.from === 'left' || stage.from === 'right';
    const span = horizontal ? bounds.width : bounds.height;
    const cross = horizontal ? bounds.height : bounds.width;
    const margin = 6 + Math.abs(stage.tilt) * (cross / 2 + 4);
    const mask = document.createElementNS(SVG_NS, 'mask');
    mask.id = `${prefix}-brush-${stage.group}`;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('mask-type', 'luminance');
    mask.setAttribute('x', String(bounds.x - 4));
    mask.setAttribute('y', String(bounds.y - 4));
    mask.setAttribute('width', String(bounds.width + 8));
    mask.setAttribute('height', String(bounds.height + 8));
    const axis = document.createElementNS(SVG_NS, 'g');
    const transforms = {
      left: `matrix(1 0 0 1 ${bounds.x} ${bounds.y})`,
      right: `matrix(-1 0 0 1 ${bounds.x + bounds.width} ${bounds.y})`,
      top: `matrix(0 1 1 0 ${bounds.x} ${bounds.y})`,
      bottom: `matrix(0 -1 1 0 ${bounds.x} ${bounds.y + bounds.height})`,
    };
    axis.setAttribute('transform', transforms[stage.from]);
    const front = document.createElementNS(SVG_NS, 'path');
    const tip = (y: number, pressure = 0) => `${stage.tilt * (y - cross / 2) + pressure} ${y}`;
    front.setAttribute('d', (isMorphV2 ? [
      `M ${-span - margin * 2} -4 L ${tip(-4, -1)}`,
      `C ${tip(cross * .10, 2)} ${tip(cross * .23, 4.5)} ${tip(cross * .34, 1)}`,
      `C ${tip(cross * .42, -.5)} ${tip(cross * .52, -3.5)} ${tip(cross * .61, -1)}`,
      `C ${tip(cross * .67, .5)} ${tip(cross * .72, 1.5)} ${tip(cross * .77, .5)}`,
      `C ${tip(cross * .84, 3)} ${tip(cross * .94, 1.5)} ${tip(cross + 4, -1)}`,
      `L ${-span - margin * 2} ${cross + 4} Z`,
    ] : [
      `M ${-span - margin * 2} -4 L ${tip(-4)}`,
      `C ${tip(cross * .12, 3)} ${tip(cross * .24, 3)} ${tip(cross * .36)}`,
      `S ${tip(cross * .55, -3)} ${tip(cross * .68)}`,
      `S ${tip(cross * .88, 2)} ${tip(cross + 4)}`,
      `L ${-span - margin * 2} ${cross + 4} Z`,
    ]).join(' '));
    front.setAttribute('fill', 'white');
    front.setAttribute('data-ja-brush', stage.group);
    axis.append(front);
    mask.append(axis);
    masks.append(mask);
    maskedElements.push({ element: group, maskId: mask.id, end: stage.end });
    const hidden = `translateX(${-margin}px)`;
    const complete = `translateX(${span + margin}px)`;
    animate(front, [
      { offset: 0, transform: hidden },
      { offset: stage.start / ENTRANCE_DURATION, transform: hidden, easing: BRUSH_EASING },
      { offset: stage.end / ENTRANCE_DURATION, transform: complete },
      { offset: 1, transform: complete },
    ]);
  }

  // The browser's millisecond clock can round just below the exact duration even at completion.
  const currentTime = () => animations[0].effect?.getComputedTiming().progress === 1
    ? ENTRANCE_DURATION
    : Number(animations[0].currentTime ?? 0);

  function syncMasks(time: number) {
    for (const { rect, width, end } of guideWindows) {
      // A zero-area consumed window avoids fractional-contact antialiasing without changing stroke opacity.
      rect.setAttribute('width', String(time >= end ? 0 : width));
    }
    for (const { element, maskId, end } of maskedElements) {
      if (end !== null && (reducedMotion.matches || time >= end)) {
        element.removeAttribute('mask');
      } else {
        element.setAttribute('mask', `url(#${maskId})`);
      }
    }
    for (const fill of outerFills) {
      const complete = reducedMotion.matches || time >= fill.end;
      if (complete || time <= fill.start) {
        fill.displacement.setAttribute('scale', '0');
      } else {
        const depth = Number.parseFloat(getComputedStyle(fill.boundary).strokeWidth) / 2;
        if (!Number.isFinite(depth)) throw new Error('The JA saturation depth could not be resolved.');
        // Material variation and attraction share one coverage field, driven by eased penetration.
        const phase = depth / 110;
        const first = Math.sin(phase);
        const second = 1 - Math.cos(phase);
        const strength = first + second;
        const blend = strength === 0 ? 0 : second / strength;
        fill.materialBlend.setAttribute('k2', String(1 - blend));
        fill.materialBlend.setAttribute('k3', String(blend));
        const progress = Math.min(1, depth / fill.maxDepth);
        const pressure = smoothstep((progress - .15) / .85);
        const sidePhase = fill.side === 'left' ? 0 : .45;
        fill.attractorDrifts.forEach((drift, index) => {
          const trajectory = progress * (index === 0 ? 1.4 : 1.05) + index * 2.2 + sidePhase;
          drift.setAttribute('dx', String((index === 0 ? 8 : 6) * Math.sin(trajectory)));
          drift.setAttribute('dy', String((index === 0 ? 10 : 12) * Math.sin(trajectory * .85 + index * .4)));
        });
        const balance = .5 + .12 * Math.sin(progress * 1.6 + sidePhase);
        fill.attractionBlend.setAttribute('k2', String(balance));
        fill.attractionBlend.setAttribute('k3', String(1 - balance));
        // Blend, rather than add, the anchors; retain the existing displacement amplitude budget.
        // Bias only their vectors as the final quarter of the core closes, by about one source unit.
        const angle = smoothstep((progress - .6) / .4) * (fill.side === 'left' ? .36 : -.32);
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        fill.torsion.setAttribute('values', [
          cosine, -sine, 0, 0, (1 - cosine + sine) / 2,
          sine, cosine, 0, 0, (1 - sine - cosine) / 2,
          0, 0, 1, 0, 0,
          0, 0, 0, 1, 0,
        ].join(' '));
        const materialScale = 9.4 * strength;
        const attractorScale = 6 * pressure;
        const scale = materialScale + attractorScale;
        const influence = scale === 0 ? 0 : attractorScale / scale;
        fill.wettingBlend.setAttribute('k2', String(1 - influence));
        fill.wettingBlend.setAttribute('k3', String(influence));
        fill.displacement.setAttribute('scale', String(scale));
      }
      fill.contours.style.display = reducedMotion.matches || time < fill.contourStart || complete ? 'none' : '';
    }
    for (const fill of morphFills) fill.sync(time, reducedMotion.matches);
  }

  function report() {
    onUpdate({ time: currentTime(), playing, reducedMotion: reducedMotion.matches });
  }

  function tick() {
    if (destroyed) return;
    const time = currentTime();
    syncMasks(time);
    if (time >= ENTRANCE_DURATION) {
      playing = false;
      syncMasks(ENTRANCE_DURATION);
      verifyCanonicalGeometry(artwork);
      report();
      frame = 0;
      return;
    }
    if (time - lastReportedTime >= 50) {
      lastReportedTime = time;
      report();
    }
    frame = window.requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    window.cancelAnimationFrame(frame);
    frame = 0;
    for (const animation of animations) animation.pause();
    syncMasks(currentTime());
    report();
  }

  function seek(time: number) {
    if (!Number.isFinite(time) || time < 0 || time > ENTRANCE_DURATION) {
      throw new RangeError(`JA timeline time must be between 0 and ${ENTRANCE_DURATION}ms.`);
    }
    pause();
    const target = reducedMotion.matches ? ENTRANCE_DURATION : time;
    for (const animation of animations) animation.currentTime = target;
    syncMasks(target);
    lastReportedTime = -Infinity;
    report();
  }

  function play() {
    if (reducedMotion.matches || currentTime() >= ENTRANCE_DURATION || playing) return;
    const time = currentTime();
    syncMasks(time);
    playing = true;
    for (const animation of animations) {
      animation.currentTime = time;
      animation.play();
    }
    report();
    frame = window.requestAnimationFrame(tick);
  }

  function replay() {
    seek(0);
    play();
  }

  function syncMotionPreference() {
    // A preference change settles immediately; opting back in never restarts motion unprompted.
    seek(ENTRANCE_DURATION);
  }

  reducedMotion.addEventListener('change', syncMotionPreference);
  if (reducedMotion.matches) seek(ENTRANCE_DURATION);
  else replay();

  return {
    play, pause, replay, seek,
    destroy() {
      destroyed = true;
      window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener('change', syncMotionPreference);
      for (const animation of animations) animation.cancel();
      for (const fill of morphFills) fill.destroy();
      for (const { element } of maskedElements) element.removeAttribute('mask');
      constructionLayer.remove();
      masks.replaceChildren();
    },
  };
}
