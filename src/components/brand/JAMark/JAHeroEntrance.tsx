import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import masterUrl from '../../../assets/brand/joint-ambition-mark.master.svg?url&no-inline';
import { mountCanonicalArtwork } from './canonicalArtwork';
import { createEntranceTimeline, type EntranceControls, type EntranceState } from './entranceTimeline';
import type { EntranceFillMode } from './morphFill';
import './ja-entrance.css';

interface JAHeroEntranceProps {
  compareSource?: boolean;
  onUpdate?: (state: EntranceState) => void;
  fillMode?: EntranceFillMode;
}

const JAHeroEntrance = forwardRef<EntranceControls, JAHeroEntranceProps>(function JAHeroEntrance(
  { compareSource = false, onUpdate, fillMode = 'current' },
  ref,
) {
  const prefix = `ja-${useId().replaceAll(':', '')}`;
  const compositionRef = useRef<SVGSVGElement>(null);
  const artworkRef = useRef<SVGGElement>(null);
  const masksRef = useRef<SVGDefsElement>(null);
  const timelineRef = useRef<ReturnType<typeof createEntranceTimeline> | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useLayoutEffect(() => {
    const composition = compositionRef.current;
    const host = artworkRef.current;
    const masks = masksRef.current;
    if (!composition || !host || !masks) throw new Error('JA entrance could not mount its SVG.');
    const artwork = mountCanonicalArtwork(host, prefix);
    const timeline = createEntranceTimeline(composition, artwork, masks, prefix, state => {
      onUpdateRef.current?.(state);
    }, fillMode);
    timelineRef.current = timeline;
    return () => {
      timeline.destroy();
      timelineRef.current = null;
      host.replaceChildren();
    };
  }, [prefix, fillMode]);

  useImperativeHandle(ref, () => {
    function timeline() {
      if (!timelineRef.current) throw new Error('The JA entrance timeline is not mounted.');
      return timelineRef.current;
    }
    return {
      play: () => timeline().play(),
      pause: () => timeline().pause(),
      replay: () => timeline().replay(),
      seek: time => timeline().seek(time),
    };
  }, []);

  return (
    <div className={`ja-entrance${compareSource ? ' ja-entrance--compare' : ''}`} aria-hidden="true">
      <svg
        ref={compositionRef}
        className="ja-entrance__composition"
        viewBox="-360 0 1800 1080"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs ref={masksRef} />
        <g className="ja-entrance__lines" fill="none" stroke="currentColor">
          <path data-ja-line="left" />
          <path data-ja-line="right" />
        </g>
        <g ref={artworkRef} className="ja-entrance__artwork" />
        {compareSource && (
          <image
            className="ja-entrance__reference"
            href={masterUrl}
            x="0"
            y="0"
            width="1080"
            height="1080"
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
    </div>
  );
});

export default JAHeroEntrance;
