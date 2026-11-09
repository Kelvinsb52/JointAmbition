import { useEffect, useRef, useState, type RefObject } from 'react';

type VisionPhase = 'italic' | 'expressive' | 'final';

interface VisionWordProps {
  active: boolean;
  reducedMotion: boolean;
  onComplete?: () => void;
  reentryEnabled?: boolean;
  stageHeroAway?: boolean | null;
  heroRef?: RefObject<HTMLElement>;
  headerRef?: RefObject<HTMLElement>;
}

export default function VisionWord({
  active, reducedMotion, onComplete, reentryEnabled = false,
  stageHeroAway = null, heroRef, headerRef,
}: VisionWordProps) {
  const [phase, setPhase] = useState<VisionPhase>('final');
  const [echoRequest, setEchoRequest] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const reentryArmedRef = useRef(false);
  const handledEchoRef = useRef(0);
  const playedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reducedMotion) {
      setPhase('final');
      playedRef.current = true;
      return;
    }

    if (!active || playedRef.current) {
      return;
    }

    playedRef.current = true;
    setPhase('italic');

    const expressiveTimer = window.setTimeout(() => setPhase('expressive'), 300);
    const finalTimer = window.setTimeout(() => setPhase('final'), 720);
    const completeTimer = window.setTimeout(() => onCompleteRef.current?.(), 1020);

    return () => {
      window.clearTimeout(expressiveTimer);
      window.clearTimeout(finalTimer);
      window.clearTimeout(completeTimer);
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!reentryEnabled || reducedMotion) {
      reentryArmedRef.current = false;
      return;
    }
    const replay = () => {
      if (!reentryArmedRef.current) return;
      reentryArmedRef.current = false;
      setEchoRequest(request => request + 1);
    };
    if (stageHeroAway !== null) {
      if (stageHeroAway) reentryArmedRef.current = true;
      else replay();
      return;
    }

    const hero = heroRef?.current;
    const word = wordRef.current;
    if (!hero || !word) return;
    let wordVisibility = 0;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero && entry.intersectionRatio <= 0.1) reentryArmedRef.current = true;
        if (entry.target === word) wordVisibility = entry.intersectionRatio;
      }
      if (wordVisibility >= 0.6) replay();
    }, {
      threshold: [0, 0.1, 0.6],
      rootMargin: `-${headerRef?.current?.getBoundingClientRect().height ?? 0}px 0px 0px 0px`,
    });
    observer.observe(hero);
    observer.observe(word);
    return () => observer.disconnect();
  }, [reentryEnabled, reducedMotion, stageHeroAway, heroRef, headerRef]);

  useEffect(() => {
    if (!reentryEnabled || reducedMotion) {
      handledEchoRef.current = echoRequest;
      if (echoRequest) setPhase('final');
      return;
    }
    if (echoRequest === handledEchoRef.current) return;
    handledEchoRef.current = echoRequest;
    setPhase('italic');
    const finalTimer = window.setTimeout(() => setPhase('final'), 300);
    // Echoes never invoke the opening completion callback or its hummingbird handoff.
    return () => window.clearTimeout(finalTimer);
  }, [echoRequest, reentryEnabled, reducedMotion]);

  return (
    <span ref={wordRef} className="vision-word" data-phase={phase} data-echo={echoRequest > 0 ? '' : undefined} aria-label="vision">
      <span className="vision-word__layer vision-word__italic" aria-hidden="true">vision</span>
      <span className="vision-word__layer vision-word__expressive" aria-hidden="true">vision</span>
      <span className="vision-word__layer vision-word__final" aria-hidden="true">vision</span>
    </span>
  );
}
