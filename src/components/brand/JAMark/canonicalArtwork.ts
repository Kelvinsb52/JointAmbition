import masterSource from '../../../assets/brand/joint-ambition-mark.master.svg?raw';

export const MARK_GROUPS = ['pgl', 'pgr', 'j1', 'j2', 'j3', 'j4', 'a1', 'a2'] as const;
export type MarkGroup = typeof MARK_GROUPS[number];

function readMaster() {
  const document = new DOMParser().parseFromString(masterSource, 'image/svg+xml');
  if (document.querySelector('parsererror')) {
    throw new Error('The canonical JA SVG could not be parsed.');
  }
  return document.documentElement;
}

export function verifyCanonicalGeometry(artwork: SVGSVGElement) {
  const master = readMaster();
  if (artwork.getAttribute('viewBox') !== master.getAttribute('viewBox')) {
    throw new Error('The JA viewBox no longer matches the canonical SVG.');
  }

  const originalGroups = Array.from(master.children).filter(node => node.localName === 'g');
  const renderedGroups = Array.from(artwork.children).filter(node => node.localName === 'g');
  if (originalGroups.length !== renderedGroups.length) {
    throw new Error('The JA group structure no longer matches the canonical SVG.');
  }

  originalGroups.forEach((original, index) => {
    const rendered = renderedGroups[index];
    if (
      rendered.getAttribute('data-ja-source-id') !== original.id ||
      rendered.getAttribute('transform') !== original.getAttribute('transform') ||
      rendered.children.length !== original.children.length
    ) {
      throw new Error(`Canonical JA group changed: ${original.id}`);
    }
    Array.from(original.children).forEach((path, pathIndex) => {
      const renderedPath = rendered.children[pathIndex];
      if (
        renderedPath.localName !== path.localName ||
        renderedPath.getAttribute('data-ja-source-id') !== path.id ||
        ['d', 'fill', 'fill-rule', 'transform'].some(
          attribute => renderedPath.getAttribute(attribute) !== path.getAttribute(attribute),
        )
      ) {
        throw new Error(`Canonical JA path changed: ${path.id}`);
      }
    });
  });
}

export function mountCanonicalArtwork(host: SVGGElement, prefix: string) {
  const artwork = document.importNode(readMaster(), true);
  if (!(artwork instanceof SVGSVGElement)) {
    throw new Error('The canonical JA artwork must have an SVG root.');
  }

  // Namespace IDs only; preserve the source hierarchy, path strings, fills, and transforms.
  for (const node of [artwork, ...artwork.querySelectorAll('[id]')]) {
    node.setAttribute('data-ja-source-id', node.id);
    node.id = `${prefix}-${node.id}`;
  }
  artwork.setAttribute('aria-hidden', 'true');
  artwork.setAttribute('focusable', 'false');
  host.append(artwork);
  verifyCanonicalGeometry(artwork);
  return artwork;
}
