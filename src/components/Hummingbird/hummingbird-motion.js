/**
 * Motion for Joint Ambition's cleaned line-art hummingbird.
 * Wing coordinates change without scaling strokes. A separate, small vertical
 * translation lets the entire bird float inside the stationary circle.
 * No animation dependencies.
 */

/** Sample the exact path used by the animation (also used for preview frames). */
export function getWingPath(points, edges, hinge, phase, strength = 1) {
  const wave = Math.sin(phase);
  const fold = 1 - 0.38 * strength * wave * wave;
  const sweep = -0.52 * strength * wave;

  const [hx, hy, endX, endY] = hinge;
  const length = Math.hypot(endX - hx, endY - hy);
  const ux = (endX - hx) / length;
  const uy = (endY - hy) / length;
  const nx = -uy;
  const ny = ux;
  const projected = points.map(([x, y]) => {
    const along = (x - hx) * ux + (y - hy) * uy;
    const across = (x - hx) * nx + (y - hy) * ny;
    if (Math.abs(across) < 0.001) return [x, y];
    return [
      hx + ux * (along + sweep * across) + nx * fold * across,
      hy + uy * (along + sweep * across) + ny * fold * across,
    ];
  });
  const number = value => Number(value.toFixed(4)).toString();
  const point = index => projected[index].map(number).join(',');
  return edges.map(([a, b]) => `M${point(a)}L${point(b)}`).join(' ');
}

export function attachHummingbirdMotion(element, options = {}) {
  const wings = element.querySelector('[data-ja-wings]');
  const bird = element.querySelector('[data-ja-bird]');
  if (!wings) throw new Error('Hummingbird SVG is missing its wing path.');
  if (!bird) throw new Error('Hummingbird SVG is missing its floating bird group.');
  const parsePairs = name => wings.getAttribute(name).split(';').map(pair => pair.split(',').map(Number));
  const points = parsePairs('data-ja-points');
  const edges = parsePairs('data-ja-edges');
  const hinge = wings.getAttribute('data-ja-hinge').split(',').map(Number);
  const restPath = wings.getAttribute('d');

  const doc = element.ownerDocument;
  const win = doc.defaultView;
  if (!win) throw new Error('Hummingbird requires a browser document.');

  const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
  const fineHover = win.matchMedia('(hover: hover)');
  const requestedSpeed = options.cyclesPerSecond;
  const speed = typeof requestedSpeed === 'number' && Number.isFinite(requestedSpeed)
    ? Math.max(0.5, Math.min(8, requestedSpeed))
    : 3.2;

  let frameId = 0;
  let lastTime = 0;
  let phase = 0;
  let amplitude = 0;
  let floatPhase = 0;
  let floatStrength = 0;
  let hovered = false;
  let focused = false;
  let burstUntil = 0;
  let destroyed = false;

  function reset() {
    if (frameId) win.cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
    phase = 0;
    amplitude = 0;
    floatPhase = 0;
    floatStrength = 0;
    wings.setAttribute('d', restPath);
    bird.removeAttribute('transform');
  }

  function draw() {
    wings.setAttribute('d', getWingPath(points, edges, hinge, phase, amplitude));
    const floatY = floatStrength * (-12 - 6 * Math.sin(floatPhase));
    bird.setAttribute('transform', `translate(0 ${floatY.toFixed(4)})`);
  }

  function frame(now) {
    frameId = 0;
    if (destroyed || reducedMotion.matches || doc.hidden || !element.isConnected) {
      reset();
      return;
    }

    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = now;
    const active = hovered || focused || now < burstUntil;
    const target = active ? 1 : 0;
    amplitude += (target - amplitude) * (1 - Math.exp(-dt / (active ? 0.085 : 0.07)));
    floatStrength += (target - floatStrength) * (1 - Math.exp(-dt / (active ? 0.16 : 0.10)));
    phase = (phase + dt * speed * Math.PI * 2) % (Math.PI * 2);
    floatPhase = (floatPhase + dt * Math.PI * 2 / 1.9) % (Math.PI * 2);

    if (!active && amplitude < 0.002 && floatStrength < 0.002) {
      reset();
      return;
    }
    draw();
    frameId = win.requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || frameId || reducedMotion.matches || doc.hidden) return;
    lastTime = 0;
    frameId = win.requestAnimationFrame(frame);
  }

  function play(duration = 1100) {
    if (destroyed || reducedMotion.matches) return;
    burstUntil = win.performance.now() + Math.max(0, duration);
    start();
  }

  function enter(event) {
    if (event.pointerType === 'touch') return;
    hovered = true;
    start();
  }
  function leave() { hovered = false; }
  function focus() {
    focused = element.matches(':focus-visible');
    if (focused) start();
  }
  function blur() { focused = false; }
  function pointerDown() { focused = false; }
  function click() { play(); }

  function syncEnvironment() {
    if (doc.hidden || reducedMotion.matches) {
      hovered = focused = false;
      burstUntil = 0;
      reset();
      return;
    }
    hovered = fineHover.matches && element.matches(':hover');
    focused = doc.activeElement === element && element.matches(':focus-visible');
    if (hovered || focused) start();
  }

  const listeners = [
    ['pointerenter', enter], ['pointerleave', leave], ['pointercancel', leave],
    ['pointerdown', pointerDown], ['focus', focus], ['blur', blur], ['click', click],
  ];
  for (const [type, listener] of listeners) element.addEventListener(type, listener);
  doc.addEventListener('visibilitychange', syncEnvironment);
  reducedMotion.addEventListener('change', syncEnvironment);
  syncEnvironment();

  return {
    play,
    destroy() {
      destroyed = true;
      reset();
      for (const [type, listener] of listeners) element.removeEventListener(type, listener);
      doc.removeEventListener('visibilitychange', syncEnvironment);
      reducedMotion.removeEventListener('change', syncEnvironment);
    },
  };
}
