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
    let distance = 0;
    let headerHeight = 0;
    let stageHeight = 0;
    let actionsBottom = 0;
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

    const update = () => {
      frame = 0;
      if (!distance) return;
      const progress = clamp((headerHeight - region.getBoundingClientRect().top) / distance);
      syncHeroAway(progress >= 0.85 ? true : progress <= 0.25 ? false : heroAway ?? false);
      syncAutoplay(progress >= 0.6 ? true : progress <= 0.2 ? false : autoplayReady ?? false);
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
    const schedule = () => {
      if (distance && !frame) frame = requestAnimationFrame(update);
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
      update();
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
