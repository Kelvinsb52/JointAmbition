'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { attachHummingbirdMotion } from './hummingbird-motion';

export interface HummingbirdProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  cyclesPerSecond?: number;
  ring?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

export default function Hummingbird({
  size = 180,
  color = '#eee7da',
  strokeWidth = 5.5,
  cyclesPerSecond = 3.2,
  ring = true,
  className = '',
  style,
}: HummingbirdProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const motion = attachHummingbirdMotion(host, { cyclesPerSecond });
    return () => motion.destroy();
  }, [cyclesPerSecond]);

  const iconStyle = {
    '--ja-hummingbird-size': typeof size === 'number' ? `${size}px` : size,
    '--ja-hummingbird-color': color,
    '--ja-hummingbird-stroke': strokeWidth,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={hostRef}
      className={`ja-hummingbird ${className}`.trim()}
      data-ring={ring ? 'true' : 'false'}
      style={iconStyle}
      aria-hidden="true"
    >
      <svg className="ja-hummingbird__svg" xmlns="http://www.w3.org/2000/svg" viewBox="110 65 850 850" aria-hidden="true" focusable="false">
        <g data-ja-bird="">
        <g data-ja-body="">
          <path d="M840.99,345.09L688.43,339.39 M688.43,339.39L671.89,318.4 M671.89,318.4L609.3,304.02 M609.3,304.02L548.88,340.65 M548.88,340.65L526.69,385.6 M526.69,385.6L502.6013,435.19 M502.6013,435.19L467.8017,506.83 M467.8017,506.83L442.62,558.67 M442.62,558.67L392.48,729.59 M392.48,729.59L430.7153,669.79 M430.7153,669.79L426.41,727.16 M426.41,727.16L450.84,713.35 M450.84,713.35L454.82,680.69 M454.82,680.69L499.25,650.82 M499.25,650.82L501.01,602.87 M501.01,602.87L585.07,527.2125 M585.07,527.2125L622.16,493.83 M622.16,493.83L639.54,385.09 M639.54,385.09L681.91,360.05 M681.91,360.05L840.99,345.09 M688.43,339.39L681.91,360.05 M681.91,360.05L627.3,340.69 M627.3,340.69L548.88,340.65 M609.3,304.02L627.3,340.69 M627.3,340.69L639.54,385.09 M639.54,385.09L598.14,442.11 M598.14,442.11L622.16,493.83 M627.3,340.69L526.69,385.6 M526.69,385.6L598.14,442.11 M598.14,442.11L502.6013,435.19 M598.14,442.11L492.74,521.1058 M492.74,521.1058L442.62,558.67 M492.74,521.1058L512.7455,581.6459 M492.74,521.1058L463.26,618.89 M463.26,618.89L459.17,633.04 M459.17,633.04L454.82,680.69 M430.7153,669.79L463.26,618.89 M463.26,618.89L512.7455,581.6459 M512.7455,581.6459L585.07,527.2125" />
        </g>
        <g>
          <path data-ja-wings="" data-ja-points="526.69,385.6;431.75,335.6;226.67,246.13;247.53,340.71;329.12,418.56;351.01,418.56;405.01,463.19;467.8017,506.83;502.6013,435.19;462.8324,379.29;480.1059,403.57;281.5252,346.8016" data-ja-edges="0,1;1,2;2,11;11,3;3,4;4,5;5,6;6,7;1,9;9,10;10,8;11,9;5,10;6,8" data-ja-hinge="526.69,385.6,442.62,558.67" d="M526.69,385.6L431.75,335.6 M431.75,335.6L226.67,246.13 M226.67,246.13L281.5252,346.8016 M281.5252,346.8016L247.53,340.71 M247.53,340.71L329.12,418.56 M329.12,418.56L351.01,418.56 M351.01,418.56L405.01,463.19 M405.01,463.19L467.8017,506.83 M431.75,335.6L462.8324,379.29 M462.8324,379.29L480.1059,403.57 M480.1059,403.57L502.6013,435.19 M281.5252,346.8016L462.8324,379.29 M351.01,418.56L480.1059,403.57 M405.01,463.19L502.6013,435.19" />
        </g>
        </g>
      </svg>
    </div>
  );
}
