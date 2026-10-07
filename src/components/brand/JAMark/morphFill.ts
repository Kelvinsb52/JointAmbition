import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import type { ConstructionSide } from './constructionGeometry';

gsap.registerPlugin(MorphSVGPlugin);

export type EntranceFillMode = 'current' | 'morph' | 'morph-v2';

// Full, ~80%, ~60%, ~40%, ~20%, ~8%, zero. Four corresponding cubic spans
// keep the material bias authored, rather than letting automatic point matching turn it.
export const CREAM_CORES: Record<ConstructionSide, readonly string[]> = {
  left: [
    'M 246 343 C 341 259 435 175 530 91 C 530 306 530 521 530 736 C 435 820 340 904 245 988 C 245 773 246 558 246 343 Z',
    'M 258 353 C 330 284 458 165 516 134 C 515 312 493 553 489 714 C 431 768 334 876 273 922 C 263 762 265 511 258 353 Z',
    'M 289 373 C 356 303 445 257 484 231 C 499 375 471 580 450 700 C 399 747 333 819 299 844 C 314 697 264 532 289 373 Z',
    'M 328 411 C 370 351 417 313 448 330 C 469 399 435 580 416 663 C 380 720 349 762 337 749 C 315 680 306 507 328 411 Z',
    'M 356 450 C 385 393 414 401 416 449 C 417 519 395 612 384 648 C 371 680 353 695 348 664 C 336 601 340 502 356 450 Z',
    'M 373 505 C 388 472 400 490 394 521 C 391 552 376 589 365 605 C 356 611 353 598 357 583 C 360 558 367 528 373 505 Z',
    'M 375 550 C 375 550 375 550 375 550 C 375 550 375 550 375 550 C 375 550 375 550 375 550 C 375 550 375 550 375 550 Z',
  ],
  right: [
    'M 551 92 C 646 176 740 260 835 344 C 835 558 835 772 835 986 C 740 903 646 819 551 736 C 551 521 551 307 551 92 Z',
    'M 565 127 C 641 169 760 291 819 362 C 812 526 824 780 810 936 C 738 880 629 782 574 716 C 571 546 583 290 565 127 Z',
    'M 598 206 C 652 239 737 331 786 396 C 804 549 777 747 775 859 C 722 813 654 756 615 695 C 589 556 625 359 598 206 Z',
    'M 636 306 C 682 313 733 389 753 444 C 772 553 752 716 730 755 C 698 735 668 687 650 629 C 628 531 654 369 636 306 Z',
    'M 679 411 C 710 419 733 465 735 516 C 746 598 724 677 709 682 C 684 668 678 620 681 581 C 688 511 661 431 679 411 Z',
    'M 706 495 C 722 509 727 540 723 559 C 721 585 713 615 701 612 C 690 603 693 579 698 561 C 705 537 695 501 706 495 Z',
    'M 708 556 C 708 556 708 556 708 556 C 708 556 708 556 708 556 C 708 556 708 556 708 556 C 708 556 708 556 708 556 Z',
  ],
};

const CORE_TIMES = [0, .18, .38, .58, .77, .91, 1] as const;
const SVG_NS = 'http://www.w3.org/2000/svg';
const easeCollapse = gsap.parseEase('sine.inOut');

export function createMorphFill(
  mask: SVGMaskElement,
  contours: SVGGElement,
  stage: { side: ConstructionSide; fillStart: number; fillEnd: number; contourStart: number },
) {
  const redCoverage = document.createElementNS(SVG_NS, 'rect');
  for (const attribute of ['x', 'y', 'width', 'height']) {
    redCoverage.setAttribute(attribute, mask.getAttribute(attribute)!);
  }
  redCoverage.setAttribute('fill', 'white');
  // The mask only reveals the canonical red path; coverage cannot escape that silhouette.
  const core = document.createElementNS(SVG_NS, 'path');
  core.setAttribute('data-ja-cream-core', stage.side);
  core.setAttribute('fill', 'black');
  core.setAttribute('d', CREAM_CORES[stage.side][0]);
  mask.append(redCoverage, core);

  const timeline = gsap.timeline({ paused: true });
  const shapes = CREAM_CORES[stage.side];
  for (let index = 1; index < shapes.length; index++) {
    timeline.fromTo(core, {
      morphSVG: { shape: shapes[index - 1], shapeIndex: 0, type: 'linear' },
    }, {
      morphSVG: { shape: shapes[index], shapeIndex: 0, type: 'linear' },
      duration: CORE_TIMES[index] - CORE_TIMES[index - 1],
      ease: 'none',
      immediateRender: false,
    }, CORE_TIMES[index - 1]);
  }

  return {
    sync(time: number, reducedMotion: boolean) {
      const complete = reducedMotion || time >= stage.fillEnd;
      const progress = Math.max(0, Math.min(1, (time - stage.fillStart) / (stage.fillEnd - stage.fillStart)));
      // GSAP never owns a playback clock; WAAPI remains the sole time source, including scrubbing.
      if (!reducedMotion) timeline.progress(easeCollapse(progress), true);
      core.style.display = complete ? 'none' : '';
      contours.style.display = reducedMotion || time < stage.contourStart || complete ? 'none' : '';
    },
    destroy() {
      timeline.kill();
    },
  };
}
