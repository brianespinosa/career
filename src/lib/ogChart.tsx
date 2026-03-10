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

export const OG_SIZE = { width: 1200, height: 630 } as const;

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
  // Arc positions are index-driven, so this order must match the order RatingsChart
  // receives from CareerThemes. CareerThemes groups attributes via
  // Object.groupBy(attributeValues, (attr) => attr.theme) and passes the result
  // as themeGroups; RatingsChart flattens it with Object.values(themeGroups).flat().
  // If either the grouping or flattening strategy changes, update buildArcs to match.
  const grouped = Object.groupBy(enriched, (a) => a.theme);
  const ordered = Object.values(grouped)
    .flat()
    .filter((a): a is NonNullable<typeof a> => a != null);
  return computeChartGeometry({ attributes: ordered });
}

// Inline styles on plain HTML elements are required throughout these components —
// next/og uses Satori under the hood, which only supports a subset of inline CSS
// and cannot render components that rely on CSS classes, CSS variables, or Radix
// primitives.
export function OgSimpleLayout() {
  return (
    <div
      style={{
        display: 'flex',
        width: `${OG_SIZE.width}px`,
        height: `${OG_SIZE.height}px`,
        background: slateDark.slate2,
        alignItems: 'center',
        padding: '60px',
        gap: '60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexShrink: 0,
          width: '250px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          role='img'
          aria-labelledby='ladder-logo-title'
          width='240'
          height='240'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <title id='ladder-logo-title'>Ladder</title>
          <path
            d='M13.9722 3.06962L7.11285 29.0903C6.97408 29.6301 6.48837 30 5.9432 30H2.85056C2.28556 30 1.88907 29.4702 2.02784 28.9304L8.88715 2.90968C9.02592 2.37986 9.51163 2 10.0667 2H13.1494C13.7144 2 14.1109 2.52981 13.9722 3.06962Z'
            fill='#7D4533'
          />
          <path
            d='M29.9726 3.06962L23.1187 29.0903C22.9702 29.6301 22.4947 30 21.9401 30H18.8499C18.2853 30 17.8892 29.4702 18.0278 28.9304L18.27 28.0109L17.3715 26.4623L19.0645 24.9947L20.1199 20.9878L19.2154 19.4619L20.9024 18.017L21.9639 13.9871L21.0599 12.4594L22.7474 11.0127L23.8146 6.9612L22.908 5.44292L24.593 4.0057L24.8817 2.90968C25.0204 2.37986 25.5057 2 26.0604 2H29.1506C29.7052 2 30.1113 2.52981 29.9726 3.06962Z'
            fill='#7D4533'
          />
          <path
            d='M19.0631 25L18.2729 28H5.54632C5.1809 28 4.91163 27.6288 5.02703 27.2575L5.56556 25.4615C5.65211 25.1806 5.89252 25 6.1714 25H19.0631Z'
            fill='#A56953'
          />
          <path
            d='M20.9069 18L20.1167 21H7.08312C6.69308 21 6.40568 20.6288 6.52885 20.2575L7.10365 18.4615C7.19603 18.1806 7.45263 18 7.7503 18H20.9069Z'
            fill='#A56953'
          />
          <path
            d='M23.8043 7L24.5945 4H11.24C10.9424 4 10.6858 4.18 10.5934 4.46L10.0289 6.26C9.90568 6.63 10.1931 7 10.5831 7H23.8043Z'
            fill='#A56953'
          />
          <path
            d='M22.7507 11H9.2503C8.95263 11 8.69603 11.1806 8.60365 11.4615L8.02885 13.2575C7.90568 13.6288 8.19308 14 8.58312 14H21.9605L22.7507 11Z'
            fill='#A56953'
          />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            fontSize: '72px',
            fontFamily: 'SinkinSans',
            fontWeight: 800,
            lineHeight: '1.1',
            color: '#ffc400',
          }}
        >
          {SITE_TITLE}
        </div>
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
        width: `${OG_SIZE.width}px`,
        height: `${OG_SIZE.height}px`,
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
            fontSize: '30px',
            fontFamily: 'Inter',
            color: slateDark.slate11,
            marginBottom: '12px',
          }}
        >
          SELF ASSESSMENT
        </div>
        <div
          style={{
            fontSize: '72px',
            fontFamily: 'SinkinSans',
            fontWeight: 800,
            lineHeight: '1.1',
            color: '#ffc400',
          }}
        >
          {levelName}
        </div>
        <div
          style={{
            fontSize: '36px',
            fontFamily: 'Inter',
            color: slateDark.slate11,
            marginTop: '32px',
          }}
        >
          {date}
        </div>
      </div>
    </div>
  );
}
