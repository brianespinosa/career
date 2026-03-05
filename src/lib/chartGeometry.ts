import { blueDark, greenDark, redDark, yellowDark } from '@radix-ui/colors';
import { scaleBand, scaleRadial } from '@visx/scale';
import { arc as d3Arc } from 'd3-shape';

export const CHART_SIZE = 100;
export const CHART_ARC_RADIANS = 2.03 * Math.PI;
const ATTRIBUTE_LEVELS = 4;
export const RADIUS_MAX = CHART_SIZE / 2; // 50
export const INNER_RADIUS = RADIUS_MAX / 5; // 10

export const THEME_HEX_COLORS: Record<string, string> = {
  red: redDark.red6,
  blue: blueDark.blue6,
  green: greenDark.green6,
  yellow: yellowDark.yellow6,
};

export type ArcGeometry = {
  key: string;
  name: string;
  colorName: string;
  hexColor: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  textX: number;
  textY: number;
  rating: number;
  pathD: string;
};

export type ChartGeometryInput = {
  attributes: Array<{
    key: string;
    name: string;
    colorName: string;
    value: number;
  }>;
};

export function computeChartGeometry(input: ChartGeometryInput): ArcGeometry[] {
  const { attributes } = input;
  const xScale = scaleBand<string>({
    range: [0, CHART_ARC_RADIANS],
    domain: attributes.map((a) => a.key),
    padding: 0.25,
  });
  const yScale = scaleRadial<number>({
    range: [INNER_RADIUS, RADIUS_MAX],
    domain: [0, ATTRIBUTE_LEVELS * 100],
  });
  const arcGen = d3Arc();

  return attributes.map((attr) => {
    const startAngle = xScale(attr.key) ?? 0;
    const endAngle = startAngle + xScale.bandwidth();
    const midAngle = startAngle + xScale.bandwidth() / 2;
    const frequency = attr.value * 100;
    const outerRadius = yScale(frequency) ?? INNER_RADIUS;
    const textRadius = outerRadius - 8;
    const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
    const textY = textRadius * Math.sin(midAngle - Math.PI / 2);
    const pathD =
      attr.value > 0
        ? (arcGen({
            innerRadius: INNER_RADIUS,
            outerRadius,
            startAngle,
            endAngle,
            padAngle: 0,
          }) ?? '')
        : '';

    return {
      key: attr.key,
      name: attr.name,
      colorName: attr.colorName,
      hexColor: THEME_HEX_COLORS[attr.colorName] ?? '#888888',
      startAngle,
      endAngle,
      midAngle,
      innerRadius: INNER_RADIUS,
      outerRadius,
      textX,
      textY,
      rating: attr.value,
      pathD,
    };
  });
}
