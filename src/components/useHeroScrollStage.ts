import { useLayoutEffect, useState, type RefObject } from 'react';

interface HeroScrollStageOptions {
  enabled: boolean;
  regionRef: RefObject<HTMLElement>;
  stageRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLElement>;
  firstRef: RefObject<HTMLDivElement>;
  secondRef: RefObject<HTMLDivElement>;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const STAGE_VISUAL_COMPLETE_AT = 0.9;
const STAGE_VISUAL_SMOOTHING_MS = 70;
const STAGE_VISUAL_EPSILON = 0.0015;

export function useHeroScrollStage({
  enabled, regionRef, stageRef, headerRef, firstRef, secondRef,
}: HeroScrollStageOptions) {
  const [stageAutoplayReady, setStageAutoplayReady] = useState<boolean | null>(null);
  const [stageHeroAway, setStageHeroAway] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const region = regionRef.current;
    const stage = stageRef.current;
    const header = headerRef.current;
    const first = firstRef.current;
    const second = secondRef.current;
    if (!enabled || !region || !stage || !header || !first || !second) {
      setStageAutoplayReady(null);
      setStageHeroAway(null);
      return;
    }

    const mobile = window.matchMedia('(max-width: 640px)');
    const content = first.querySelector<HTMLElement>('.hero-copy__scene-content');
    const cue = first.querySelector<HTMLElement>('.hero-swipe-cue');
    const actions = first.querySelector<HTMLElement>('.hero-actions');
    const motif = second.querySelector<HTMLElement>('.motif-stage');
    let frame = 0;
    let visualFrame = 0;
    let lastVisualFrameTime = 0;
    let distance = 0;
    let headerHeight = 0;
    let stageHeight = 0;
    let actionsBottom = 0;
    let targetProgress = 0;
    let targetVisualProgress = 0;
    let displayedVisualProgress = 0;
    let autoplayReady: boolean | null = null;
    let heroAway: boolean | null = null;
    const syncHeroAway = (away: boolean | null) => {
      if (away === heroAway) return;
      heroAway = away;
      setStageHeroAway(away);
    };
    const syncAutoplay = (ready: boolean | null) => {
      if (ready === autoplayReady) return;
      autoplayReady = ready;
      setStageAutoplayReady(ready);
    };

    const applyVisualProgress = (progress: number) => {
      const entry = clamp((progress - 0.1) / 0.78);
      const reveal = 1 - (1 - entry) ** 2;
      const cueProgress = clamp(progress / 0.3);
      stage.style.setProperty('--hero-y', `${-36 * progress}px`);
      stage.style.setProperty('--hero-opacity', `${(1 - 0.14 * progress) * (1 - clamp((progress - 0.55) / 0.2))}`);
      stage.style.setProperty('--scene-y', `${100 * (1 - reveal)}%`);
      stage.style.setProperty('--cue-progress', `${cueProgress}`);
      // Covered CTAs must not remain keyboard focus targets underneath the second panel.
      if (actions) actions.inert = actionsBottom - 36 * progress > stageHeight * (1 - reveal);
    };
    const stepVisualProgress = (time: number) => {
      visualFrame = 0;
      const dt = lastVisualFrameTime ? Math.min(time - lastVisualFrameTime, 64) : 16;
      lastVisualFrameTime = time;
      const alpha = 1 - Math.exp(-dt / STAGE_VISUAL_SMOOTHING_MS);
      displayedVisualProgress += (targetVisualProgress - displayedVisualProgress) * alpha;
      if (Math.abs(targetVisualProgress - displayedVisualProgress) <= STAGE_VISUAL_EPSILON) {
        displayedVisualProgress = targetVisualProgress;
      }
      applyVisualProgress(displayedVisualProgress);
      if (displayedVisualProgress !== targetVisualProgress) {
        visualFrame = requestAnimationFrame(stepVisualProgress);
      }
    };
    const syncVisualProgress = (immediate = false) => {
      if (immediate) {
        if (visualFrame) {
          cancelAnimationFrame(visualFrame);
          visualFrame = 0;
        }
        lastVisualFrameTime = 0;
        displayedVisualProgress = targetVisualProgress;
        applyVisualProgress(displayedVisualProgress);
        return;
      }
      if (!visualFrame) visualFrame = requestAnimationFrame(stepVisualProgress);
    };
    const updateStage = (immediate = false) => {
      if (!distance) return;
      targetProgress = clamp((headerHeight - region.getBoundingClientRect().top) / distance);
      targetVisualProgress = clamp(targetProgress / STAGE_VISUAL_COMPLETE_AT);
      syncHeroAway(targetProgress >= 0.85 ? true : targetProgress <= 0.25 ? false : heroAway ?? false);
      syncAutoplay(targetProgress >= 0.6 ? true : targetProgress <= 0.2 ? false : autoplayReady ?? false);
      syncVisualProgress(immediate);
    };
    const updateFromFrame = () => {
      frame = 0;
      updateStage(false);
    };
    const schedule = () => {
      if (distance && !frame) frame = requestAnimationFrame(updateFromFrame);
    };
    const measure = () => {
      const firstStyle = getComputedStyle(first);
      const secondStyle = getComputedStyle(second);
      const available = parseFloat(firstStyle.minHeight);
      const firstHeight = (content?.offsetHeight ?? 0) + (cue?.offsetHeight ?? 0)
        + parseFloat(firstStyle.paddingTop) + parseFloat(firstStyle.paddingBottom);
      const secondHeight = (motif?.offsetHeight ?? 0)
        + parseFloat(secondStyle.paddingTop) + parseFloat(secondStyle.paddingBottom);
      // Keep all content reachable when text enlargement or a short viewport cannot fit the stage.
      const fits = mobile.matches && firstHeight <= available + 1 && secondHeight <= available + 1;
      region.toggleAttribute('data-scroll-stage', fits);
      headerHeight = header.getBoundingClientRect().height;
      stageHeight = stage.clientHeight;
      actionsBottom = actions ? actions.offsetTop + actions.offsetHeight : 0;
      distance = fits ? region.clientHeight - stage.clientHeight : 0;
      if (!fits) {
        syncAutoplay(null);
        syncHeroAway(null);
        stage.removeAttribute('style');
        if (actions) actions.inert = false;
      }
      updateStage(true);
    };

    const observer = new ResizeObserver(measure);
    for (const element of [header, first, content, cue, motif]) {
      if (element) observer.observe(element);
    }
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    mobile.addEventListener('change', measure);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(visualFrame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      mobile.removeEventListener('change', measure);
      region.removeAttribute('data-scroll-stage');
      stage.removeAttribute('style');
      if (actions) actions.inert = false;
    };
  }, [enabled, regionRef, stageRef, headerRef, firstRef, secondRef]);

  return { stageAutoplayReady, stageHeroAway };
}
