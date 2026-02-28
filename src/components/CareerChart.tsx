'use client';

import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { ScaleSVG } from '@visx/responsive';
import { scaleLinear } from '@visx/scale';
import { Line, LineRadial } from '@visx/shape';
import { useSearchParams } from 'next/navigation';
import ATTRIBUTES from '@/data/attributes.json';
import type { AttributeKeys } from '@/types/attributes';

const STROKE_WEIGHT = 0.5;
const ATTRIBUTE_LEVELS = 4;

const PRIMARY_COLOR = 'var(--accent-7)';
const GRAY_COLOR = 'var(--gray-5)';

const SIZE = 100;
const DEGREES = 360;
const RADIUS = (SIZE - STROKE_WEIGHT * 4) / 2;

const y = (d: { attribute: string; value: number }) => d.value;

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle:
      i * (DEGREES / length) + (length % 2 === 0 ? 0 : DEGREES / length / 2),
  }));

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

function genPolygonPoints<Datum>(
  dataArray: Datum[],
  scale: (n: number) => number,
  getValue: (d: Datum) => number,
) {
  const step = (Math.PI * 2) / dataArray.length;
  const points: { x: number; y: number }[] = new Array(dataArray.length).fill({
    x: 0,
    y: 0,
  });
  const pointString: string = new Array(dataArray.length + 1)
    .fill('')
    .reduce((res, _, i) => {
      if (i > dataArray.length) return res;
      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };
      res += `${xVal},${yVal} `;
      return res;
    });

  return { points, pointString };
}

interface CareerChartProps {
  attributes: [AttributeKeys, string][];
}

const CareerChart = ({ attributes }: CareerChartProps) => {
  const searchParams = useSearchParams();

  const attributesWithValues = attributes.map((attribute) => {
    const param = ATTRIBUTES[attribute[0]].param;

    return {
      attribute: param,
      value: Number(searchParams.get(param)) || 0,
    };
  });

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [DEGREES, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, RADIUS],
    domain: [0, ATTRIBUTE_LEVELS],
  });

  const webs = genAngles(attributesWithValues.length);
  const points = genPoints(attributesWithValues.length, RADIUS);
  const polygonPoints = genPolygonPoints(
    attributesWithValues,
    (d) => yScale(d) ?? 0,
    y,
  );
  const zeroPoint = new Point({ x: 0, y: 0 });

  return (
    <ScaleSVG width={SIZE} height={SIZE}>
      <Group top={SIZE / 2} left={SIZE / 2}>
        {[...new Array(ATTRIBUTE_LEVELS)].map((_, i) => (
          <LineRadial
            key={`web-${i}`}
            data={webs}
            angle={(d) => radialScale(d.angle) ?? 0}
            radius={((i + 1) * RADIUS) / ATTRIBUTE_LEVELS}
            fill='none'
            stroke={GRAY_COLOR}
            strokeWidth={STROKE_WEIGHT}
            strokeLinecap='round'
          />
        ))}
        {[...new Array(attributes.length)].map((_, i) => (
          <Line
            key={`radar-line-${i}`}
            from={zeroPoint}
            to={points[i]}
            stroke={GRAY_COLOR}
            strokeWidth={STROKE_WEIGHT}
          />
        ))}
        <polygon
          points={polygonPoints.pointString}
          fill={PRIMARY_COLOR}
          fillOpacity={0.3}
          stroke={PRIMARY_COLOR}
          strokeWidth={STROKE_WEIGHT * 1.5}
        />
        {polygonPoints.points.map((point, i) => (
          <circle
            key={`radar-point-${i}`}
            cx={point.x}
            cy={point.y}
            r={STROKE_WEIGHT * 2}
            fill={PRIMARY_COLOR}
          />
        ))}
      </Group>
    </ScaleSVG>
  );
};

export default CareerChart;
