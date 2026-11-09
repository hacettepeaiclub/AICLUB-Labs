import type { CSSProperties, HTMLAttributes, ReactElement } from "react";

type Vec2 = [number, number];

export type FaultyTerminalGlyphs = "blocks" | "dots" | "characters";
export type FaultyTerminalClickEffect = "glitch" | "degauss" | "none";

export interface FaultyTerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
  glyphs?: FaultyTerminalGlyphs;
  glow?: number;
  persistence?: number;
  scramble?: number;
  mouseGlow?: number;
  vignette?: number;
  clickEffect?: FaultyTerminalClickEffect;
  variation?: number;
  lightMode?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

export default function FaultyTerminal(props: FaultyTerminalProps): ReactElement;
