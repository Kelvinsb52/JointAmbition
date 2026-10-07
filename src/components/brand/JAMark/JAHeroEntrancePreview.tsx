import { useRef, useState } from 'react';
import { Link } from 'react-router';
import masterUrl from '../../../assets/brand/joint-ambition-mark.master.svg?url&no-inline';
import JAHeroEntrance from './JAHeroEntrance';
import { ENTRANCE_DURATION, type EntranceControls, type EntranceState } from './entranceTimeline';

export default function JAHeroEntrancePreview() {
  const entrance = useRef<EntranceControls>(null);
  const [state, setState] = useState<EntranceState>({ time: 0, playing: false, reducedMotion: false });
  const [compareSource, setCompareSource] = useState(false);

  function replay() {
    setCompareSource(false);
    entrance.current?.replay();
  }

  return (
    <main className="ja-entrance-preview">
      <header className="ja-entrance-preview__header">
        <div>
          <p className="ja-entrance-preview__eyebrow">Joint Ambition / Phase 1</p>
          <h1>Insignia motion study</h1>
        </div>
        <Link to="/">Return to the unchanged home page</Link>
      </header>

      <JAHeroEntrance ref={entrance} compareSource={compareSource} onUpdate={setState} />

      <section className="ja-entrance-preview__controls" aria-label="Prototype controls">
        <div className="ja-entrance-preview__actions">
          <button type="button" onClick={replay} disabled={state.reducedMotion}>Replay</button>
          <button
            type="button"
            disabled={state.reducedMotion || compareSource || state.time >= ENTRANCE_DURATION}
            onClick={() => state.playing ? entrance.current?.pause() : entrance.current?.play()}
          >
            {state.playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={() => entrance.current?.seek(ENTRANCE_DURATION)}>Completed mark</button>
          <output aria-live="off">{(state.time / 1000).toFixed(2)} / {(ENTRANCE_DURATION / 1000).toFixed(2)} s</output>
        </div>
        <label className="ja-entrance-preview__scrubber">
          Timeline
          <input
            type="range"
            min="0"
            max={ENTRANCE_DURATION}
            step="10"
            value={state.time}
            disabled={state.reducedMotion || compareSource}
            aria-valuetext={`${(state.time / 1000).toFixed(2)} seconds of ${ENTRANCE_DURATION / 1000} seconds`}
            onChange={event => entrance.current?.seek(Number(event.currentTarget.value))}
          />
        </label>
        <label className="ja-entrance-preview__comparison">
          <input
            type="checkbox"
            checked={compareSource}
            onChange={event => {
              entrance.current?.seek(ENTRANCE_DURATION);
              setCompareSource(event.currentTarget.checked);
            }}
          />
          Overlay canonical source at 50% (original black/white colors)
        </label>
        <p>
          An exact match has no doubled edges. This view bypasses the reveal and preserves the
          source viewBox, all eight paths, and the translated J detail.
          {' '}<a href={masterUrl} target="_blank" rel="noreferrer">Open the untouched source SVG</a>.
        </p>
        {state.reducedMotion && (
          <p role="status">Reduced motion is enabled. The complete mark is shown; drawing and scrubbing are disabled.</p>
        )}
      </section>

      <section className="ja-entrance-preview__notes" aria-label="Timing guide">
        <h2>Inscription / architecture / saturation / brushed revelation</h2>
        <ol>
          <li>0.00-0.24 s: cream field.</li>
          <li>0.24-1.41 s: separate arrivals at the left/right outer edges, never at the center.</li>
          <li>1.32-2.46 s: leading strokes split around the perimeter; horizontal tails chase into contact by 2.16 s.</li>
          <li>2.18-3.35 s: decisive paired saturation, with a 50 ms right-side stagger; red settles before the final letter strokes.</li>
          <li>2.68-3.88 s: J joins around 60% saturation: j1 (left-right), j3 (down), j2 (right-left), j4 (up); 50 ms handoffs.</li>
          <li>2.82-3.77 s: A joins 140 ms after J; a2 downward, then a1 upward, with a 50 ms stroke overlap.</li>
          <li>3.88-4.06 s: the exact canonical mark holds; study duration follows the last gesture, not a fixed time limit.</li>
        </ol>
        <p>
          Only the active brush frontier has slight pressure variation; finished edges stay canonical.
          Two broad, phase-offset influences guide each unified saturation frontier, with a slight torque
          near closure. The red settles first, leaving the final emphasis to the slower J/A gestures.
          No paper texture, hero choreography, or scroll-linked behavior is included.
        </p>
      </section>
    </main>
  );
}
