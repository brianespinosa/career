import { slateDark } from '@radix-ui/colors';
import ATTRIBUTES from '@/data/attributes.json';
import THEMES from '@/data/themes.json';
import {
  type ArcGeometry,
  CHART_SIZE,
  computeChartGeometry,
} from '@/lib/chartGeometry';
import { LEVELS } from '@/lib/levels';
import { SITE_TITLE } from '@/lib/siteConfig';
import type { LevelKeys } from '@/types/levels';

export function buildArcs(
  level: LevelKeys,
  ratings: Record<string, number>,
): ArcGeometry[] {
  const { attributes: levelAttributes } = LEVELS[level];
  const enriched = Object.values(ATTRIBUTES)
    .map((attribute) => {
      const themeEntry = THEMES[attribute.theme as keyof typeof THEMES];
      if (!themeEntry) {
        console.error(
          `[buildArcs] Unknown theme "${attribute.theme}" on attribute "${attribute.key}". Expected one of: ${Object.keys(THEMES).join(', ')}.`,
        );
      }
      return {
        key: attribute.key,
        name: attribute.name,
        theme: attribute.theme,
        colorName: themeEntry?.color ?? 'red',
        value:
          attribute.key in levelAttributes
            ? (ratings[attribute.param] ?? 0)
            : -1,
      };
    })
    .filter((a) => a.value >= 0);
  // Arc positions are index-driven, so this order must match what RatingsChart
  // passes to computeChartGeometry. Both derive order from
  // Object.groupBy(attributes, (a) => a.theme) on the same ATTRIBUTES dataset.
  // If RatingsChart's ordering strategy changes, update buildArcs to match.
  const grouped = Object.groupBy(enriched, (a) => a.theme);
  const ordered = Object.values(grouped)
    .flat()
    .filter((a): a is NonNullable<typeof a> => a != null);
  return computeChartGeometry({ attributes: ordered });
}

// Inline styles are required throughout these components — next/og uses Satori
// under the hood, which cannot resolve CSS classes or Radix component props.
export function OgSimpleLayout() {
  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        background: slateDark.slate2,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          fontSize: '72px',
          fontWeight: 700,
          color: slateDark.slate12,
          textAlign: 'center',
        }}
      >
        {SITE_TITLE}
      </div>
    </div>
  );
}

export function OgLayout({
  levelName,
  arcs,
  date,
}: {
  levelName: string;
  arcs: ArcGeometry[];
  date: string;
}) {
  const SVG_SIZE = CHART_SIZE * 5;

  return (
    <div
      style={{
        display: 'flex',
        width: '1200px',
        height: '630px',
        background: slateDark.slate2,
        alignItems: 'center',
        padding: '60px',
        gap: '60px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexShrink: 0 }}>
        <svg
          role='img'
          aria-label={`Ratings chart for ${levelName}`}
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        >
          <g transform={`translate(${CHART_SIZE / 2}, ${CHART_SIZE / 2})`}>
            {arcs.map((arc) =>
              arc.pathD ? (
                <path key={arc.key} d={arc.pathD} fill={arc.hexColor} />
              ) : null,
            )}
          </g>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            fontSize: '24px',
            color: slateDark.slate11,
            marginBottom: '12px',
          }}
        >
          {SITE_TITLE}
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: '1.1',
            color: slateDark.slate12,
          }}
        >
          {levelName}
        </div>
        <div
          style={{
            fontSize: '24px',
            color: slateDark.slate11,
            marginTop: '12px',
          }}
        >
          {date}
        </div>
      </div>
    </div>
  );
}
