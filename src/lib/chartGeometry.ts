import { blueDark, greenDark, redDark, yellowDark } from '@radix-ui/colors';
import { scaleBand, scaleRadial } from '@visx/scale';
import { arc as d3Arc } from 'd3-shape';

export const CHART_SIZE = 100;
const CHART_ARC_RADIANS = 2.03 * Math.PI;
const ATTRIBUTE_LEVELS = 4;
export const RADIUS_MAX = CHART_SIZE / 2;
export const INNER_RADIUS = RADIUS_MAX / 5; // 20% of radius, keeps the donut hole proportional

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

type ChartAttributeInput = {
  key: string;
  name: string;
  colorName: string;
  value: number;
};

type ChartGeometryInput = {
  attributes: ChartAttributeInput[];
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
  const arcGen = d3Arc().cornerRadius(1);

  return attributes.map((attr) => {
    const rawStartAngle = xScale(attr.key);
    if (rawStartAngle === undefined) {
      console.error(
        `[computeChartGeometry] xScale returned undefined for key "${attr.key}". Key may be missing from domain or duplicated.`,
      );
    }
    const startAngle = rawStartAngle ?? 0;
    const endAngle = startAngle + xScale.bandwidth();
    const midAngle = startAngle + xScale.bandwidth() / 2;
    const frequency = attr.value * 100;
    const rawOuterRadius = yScale(frequency);
    if (rawOuterRadius === undefined) {
      console.error(
        `[computeChartGeometry] yScale returned undefined for frequency ${frequency} (value: ${attr.value}, key: "${attr.key}"). Value may be outside domain [0, ${ATTRIBUTE_LEVELS * 100}].`,
      );
    }
    const outerRadius = rawOuterRadius ?? INNER_RADIUS;
    const textRadius = outerRadius - 8;
    const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
    const textY = textRadius * Math.sin(midAngle - Math.PI / 2);
    let pathD = '';
    if (attr.value > 0) {
      const rawPath = arcGen({
        innerRadius: INNER_RADIUS,
        outerRadius,
        startAngle,
        endAngle,
        padAngle: 0,
      });
      if (rawPath === null) {
        console.error(
          `[computeChartGeometry] d3Arc returned null for key "${attr.key}" (outerRadius: ${outerRadius}, startAngle: ${startAngle}, endAngle: ${endAngle}). Arc will be omitted.`,
        );
      }
      pathD = rawPath ?? '';
    }

    const hexColor = THEME_HEX_COLORS[attr.colorName];
    if (hexColor === undefined) {
      console.error(
        `[computeChartGeometry] No hex color mapping for colorName "${attr.colorName}" on attribute "${attr.key}". Known colors: ${Object.keys(THEME_HEX_COLORS).join(', ')}.`,
      );
    }

    return {
      key: attr.key,
      name: attr.name,
      colorName: attr.colorName,
      hexColor: hexColor ?? '#888888',
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
