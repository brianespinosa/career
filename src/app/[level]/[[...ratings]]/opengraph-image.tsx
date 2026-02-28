import { scaleBand, scaleRadial } from '@visx/scale';
import { ImageResponse } from 'next/og';

import ATTRIBUTES from '@/data/attributes.json';
import THEMES from '@/data/themes.json';
import { LEVELS } from '@/lib/levels';
import { parseRatings } from '@/lib/ratingPath';

export const runtime = 'edge';
export const alt = 'Career Ladder radial chart';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Hardcoded Radix dark palette *-6 hex values (dark appearance)
const THEME_COLORS: Record<string, string> = {
  red: '#72232d',
  blue: '#104d87',
  green: '#20573e',
  yellow: '#524202',
};

const BACKGROUND = '#111113';
const FOREGROUND = '#edeef0';

// Chart constants — matches AltChart.tsx
const ATTRIBUTE_LEVELS = 4;
const SIZE = 100;
const CHART_ARC_RADIANS = 2.03 * Math.PI;
const PADDING = 0.25;

// Compute an SVG arc path for a single bar
function arcPath(
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
): string {
  const clampedOuter = Math.max(outerRadius, innerRadius + 0.1);

  const cosStart = Math.cos(startAngle - Math.PI / 2);
  const sinStart = Math.sin(startAngle - Math.PI / 2);
  const cosEnd = Math.cos(endAngle - Math.PI / 2);
  const sinEnd = Math.sin(endAngle - Math.PI / 2);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const ox1 = clampedOuter * cosStart;
  const oy1 = clampedOuter * sinStart;
  const ox2 = clampedOuter * cosEnd;
  const oy2 = clampedOuter * sinEnd;
  const ix1 = innerRadius * cosEnd;
  const iy1 = innerRadius * sinEnd;
  const ix2 = innerRadius * cosStart;
  const iy2 = innerRadius * sinStart;

  return [
    `M ${ox1} ${oy1}`,
    `A ${clampedOuter} ${clampedOuter} 0 ${largeArc} 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
    'Z',
  ].join(' ');
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ level: string; ratings?: string[] }>;
}) {
  const { level, ratings: ratingsSegments = [] } = await params;

  const levelData = LEVELS[level as keyof typeof LEVELS];
  if (!levelData) {
    return new ImageResponse(
      <div
        style={{
          background: BACKGROUND,
          color: FOREGROUND,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
        }}
      >
        Career Ladder
      </div>,
      size,
    );
  }

  const ratingsMap = parseRatings(level, ratingsSegments);

  // Build attribute list in the same order as CareerThemes
  const attributeList = Object.values(ATTRIBUTES)
    .map((attribute) => ({
      ...attribute,
      description:
        levelData.attributes[
          attribute.key as keyof typeof levelData.attributes
        ],
      color: THEMES[attribute.theme as keyof typeof THEMES].color,
      value: ratingsMap[attribute.param] ?? 0,
    }))
    .filter(({ description }) => description !== undefined);

  const attributeKeys = attributeList.map((a) => a.key);

  const radiusMax = SIZE / 2;
  const innerRadius = radiusMax / 5;

  const xScale = scaleBand<string>({
    range: [0, CHART_ARC_RADIANS],
    domain: attributeKeys,
    padding: PADDING,
  });

  const yScale = scaleRadial<number>({
    range: [innerRadius, radiusMax],
    domain: [0, ATTRIBUTE_LEVELS * 100],
  });

  const arcs = attributeList.map((attribute) => {
    const startAngle = xScale(attribute.key) ?? 0;
    const endAngle = startAngle + xScale.bandwidth();
    const outerRadius = yScale(attribute.value * 100) ?? innerRadius;
    const color =
      THEME_COLORS[attribute.color as keyof typeof THEME_COLORS] ?? '#444';

    return { startAngle, endAngle, outerRadius, color, key: attribute.key };
  });

  const hasRatings = attributeList.some((a) => a.value > 0);

  const CHART_DISPLAY = 500;

  return new ImageResponse(
    <div
      style={{
        background: BACKGROUND,
        color: FOREGROUND,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 80px',
        gap: 60,
      }}
    >
      {/* Left: title and level info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          flex: '0 0 auto',
          maxWidth: 500,
        }}
      >
        <div style={{ fontSize: 28, color: '#888', letterSpacing: 2 }}>
          CAREER LADDER
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {levelData.name}
        </div>
        <div style={{ fontSize: 32, color: '#888' }}>{levelData.key}</div>
        {!hasRatings && (
          <div style={{ fontSize: 24, color: '#666', marginTop: 16 }}>
            No ratings yet
          </div>
        )}
      </div>

      {/* Right: chart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <svg
          width={CHART_DISPLAY}
          height={CHART_DISPLAY}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role='img'
          aria-label='Career ratings radial chart'
        >
          <g transform={`translate(${SIZE / 2}, ${SIZE / 2})`}>
            {/* Background ring */}
            <circle
              r={radiusMax - 0.5}
              fill='none'
              stroke='#222'
              strokeWidth={1}
            />
            <circle
              r={innerRadius}
              fill='none'
              stroke='#333'
              strokeWidth={0.5}
            />
            {arcs.map(({ key, startAngle, endAngle, outerRadius, color }) =>
              outerRadius > innerRadius ? (
                <path
                  key={key}
                  d={arcPath(startAngle, endAngle, innerRadius, outerRadius)}
                  fill={color}
                />
              ) : null,
            )}
          </g>
        </svg>
      </div>
    </div>,
    size,
  );
}
