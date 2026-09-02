import React from 'react';
import Svg, { Rect, Path, Ellipse } from 'react-native-svg';
import { theme } from '../theme/theme';

interface CarIllustrationProps {
  width?: number | string;
  height?: number | string;
}

export const CarIllustration: React.FC<CarIllustrationProps> = ({ width = '100%', height = '100%' }) => {
  return (
    <Svg viewBox="0 0 358 201" width={width} height={height}>
      {/* Background wash */}
      <Rect width="358" height="201" fill={theme.colors.wash} />

      {/* Construction lines */}
      <Path
        d="M23 46h54m-27-17v57M278 38h57m-27-16v63M42 165h58m204 0h17M94 27l22-15m177 147 29-10"
        fill="none"
        stroke={theme.colors.cobalt}
        strokeWidth={1.35}
        strokeLinecap="round"
        opacity={0.74}
      />
      <Path
        d="M31 67h23m-11-12v36m259-6h30M62 153l-19 19m251-2 24 8M116 25l17-8m126 18 14-11"
        fill="none"
        stroke={theme.colors.cobalt}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="4, 5"
        opacity={0.56}
      />

      {/* Fine ground / alignment line */}
      <Path
        d="M42 157c49-8 223-7 282 1"
        fill="none"
        stroke={theme.colors.ink}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Car Body */}
      <Path
        d="M60 137l13-22 35-17 45-17 68 3 42 19 31 31-8 15-26 1c-2 14-12 22-26 22-13 0-22-8-24-21l-82-1c-2 14-12 22-26 21-13-1-21-9-22-22l-16-2z"
        fill={theme.colors.pale}
        stroke={theme.colors.ink}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Windows */}
      <Path
        d="M112 99l17-15 41-2 9 23-73-1z"
        fill={theme.colors.wash}
        stroke={theme.colors.ink}
        strokeWidth={1.45}
        strokeLinejoin="round"
      />
      <Path
        d="M181 82l37 2 28 22-58-1z"
        fill={theme.colors.wash}
        stroke={theme.colors.ink}
        strokeWidth={1.45}
        strokeLinejoin="round"
      />

      {/* Ink pillars and panel lines */}
      <Path
        d="M179 83l1 22m-51-21 12 21m57-21 3 21M95 111l146 1m-154 9 152 1m-163 12 41 1m110 0 41 1"
        fill="none"
        stroke={theme.colors.ink}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Front lights / trim detail */}
      <Path
        d="M72 125l23 1-3 14-27-2z"
        fill={theme.colors.cobalt}
        stroke={theme.colors.ink}
        strokeWidth={1.15}
        strokeLinejoin="round"
      />
      <Path
        d="M72 125l23 1-3 14-27-2m10-13 17 1m-14 5 15 1"
        fill="none"
        stroke={theme.colors.ink}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Headlight lenses */}
      <Ellipse cx={76} cy={130} rx={3.2} ry={3.6} fill={theme.colors.paper} stroke={theme.colors.ink} strokeWidth={1.05} />
      <Ellipse cx={86} cy={131} rx={3.2} ry={3.6} fill={theme.colors.paper} stroke={theme.colors.ink} strokeWidth={1.05} />

      <Path d="M69 137h24m-20 4 18 1" fill="none" stroke={theme.colors.ink} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />

      {/* Front Wheel & Hub */}
      <Ellipse cx={112} cy={153} rx={18} ry={21} fill={theme.colors.wash} stroke={theme.colors.ink} strokeWidth={1.7} />
      <Ellipse cx={112} cy={153} rx={8} ry={11} fill={theme.colors.paper} stroke={theme.colors.ink} strokeWidth={1.1} />
      <Path d="M112 143v20m-7-10h14" fill="none" stroke={theme.colors.ink} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />

      {/* Rear Wheel & Hub */}
      <Ellipse cx={249} cy={154} rx={18} ry={21} fill={theme.colors.wash} stroke={theme.colors.ink} strokeWidth={1.7} />
      <Ellipse cx={249} cy={154} rx={8} ry={11} fill={theme.colors.paper} stroke={theme.colors.ink} strokeWidth={1.1} />
      <Path d="M249 144v20m-7-10h14" fill="none" stroke={theme.colors.ink} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />

      {/* Shadow & ground strokes */}
      <Path
        d="M93 147h-23m177 1h34m-194-36-16 4m168-1 30 10m-196 34-28 11m252-10 24 8"
        fill="none"
        stroke={theme.colors.ink}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dimensional markup */}
      <Path
        d="M304 118v25m-8-25h16m-5 25h12M92 49h24m-12-10v22"
        fill="none"
        stroke={theme.colors.cobalt}
        strokeWidth={1.35}
        strokeLinecap="round"
        opacity={0.74}
      />
    </Svg>
  );
};
