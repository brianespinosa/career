'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import ATTRIBUTES from '@/data/attributes.json';
import type { AttributeKeys } from '@/types/attributes';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { ScaleSVG } from '@visx/responsive';
import { scaleBand, scaleRadial } from '@visx/scale';
import { Arc } from '@visx/shape';
import { Text } from '@visx/text';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';

const PRIMARY_COLOR = 'var(--accent-7)';
const TEXT_COLOR = 'var(--color-panel-solid)';
const ATTRIBUTE_LEVELS = 4;

const SIZE = 100;
const SIMPLE_PI = 3.14;

const tooltipStyles = {
  ...defaultStyles,
  background: TEXT_COLOR,
  border: '1px solid var(--gray-5)',
  color: 'var(--gray-12)',
};

type AttributeValues = {
  attribute: string;
  value: number;
};

const getAttribute = (d: AttributeValues) => d.attribute;
const getAttributeFrequency = (d: AttributeValues) => Number(d.value) * 100;
const toDegrees = (x: number) => (x * 180) / SIMPLE_PI;

interface AltChartProps {
  attributes: [AttributeKeys, string][];
}

const AltChart = ({ attributes }: AltChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const searchParams = useSearchParams();
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  // bounds
  const radiusMax = SIZE / 2;

  const innerRadius = radiusMax / 5;

  const attributesWithValues = attributes.map((attribute) => {
    const { param, name } = ATTRIBUTES[attribute[0]];

    return {
      attribute: name,
      value: Number(searchParams.get(param)) || 0,
    };
  });

  const xDomain = useMemo(() => attributesWithValues.map(getAttribute), [
    attributesWithValues,
  ]);

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, 2.03 * SIMPLE_PI],
        domain: xDomain,
        padding: 0.25,
      }),
    [xDomain]
  );

  const yScale = useMemo(
    () =>
      scaleRadial<number>({
        range: [innerRadius, radiusMax],
        domain: [0, ATTRIBUTE_LEVELS * 100],
      }),
    [innerRadius, radiusMax]
  );

  return (
    isClient && (
      <>
        <ScaleSVG width={SIZE} height={SIZE}>
          <Group top={SIZE / 2} left={SIZE / 2}>
            {attributesWithValues.map((d) => {
              const attr = getAttribute(d);
              const startAngle = xScale(attr) || 0;
              const midAngle = startAngle + xScale.bandwidth() / 2;
              const endAngle = startAngle + xScale.bandwidth();

              const attributeFrequency = getAttributeFrequency(d);
              const attributeNumber = attributeFrequency / 100;

              const outerRadius = yScale(attributeFrequency) ?? 0;

              // convert polar coordinates to cartesian for drawing labels
              const textRadius = outerRadius - 8;
              const textX = textRadius * Math.cos(midAngle - SIMPLE_PI / 2);
              const textY = textRadius * Math.sin(midAngle - SIMPLE_PI / 2);

              return (
                <Fragment key={`bar-${attr}`}>
                  <Arc
                    cornerRadius={1}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    outerRadius={outerRadius}
                    innerRadius={innerRadius}
                    fill={PRIMARY_COLOR}
                    onClick={() => {
                      console.log('TODO: Scroll to', attr);
                    }}
                    onPointerMove={(event) => {
                      const ownerSVGElement = (event.target as SVGElement)
                        .ownerSVGElement;
                      if (!ownerSVGElement) {
                        return; // Exit early if ownerSVGElement is null
                      }
                      const coords = localPoint(ownerSVGElement, event);
                      showTooltip({
                        tooltipData: attr,
                        tooltipTop: (coords?.y ?? 0) + 10,
                        tooltipLeft: (coords?.x ?? 0) + 10,
                      });
                    }}
                    onMouseOut={hideTooltip}
                  />
                  <Text
                    style={{ pointerEvents: 'none' }}
                    x={textX}
                    y={textY}
                    dominantBaseline='end'
                    textAnchor='middle'
                    fontSize='5'
                    fontWeight='bold'
                    fill={TEXT_COLOR}
                    angle={toDegrees(midAngle)}
                  >
                    {attributeNumber}
                  </Text>
                </Fragment>
              );
            })}
          </Group>
        </ScaleSVG>
        {tooltipOpen && tooltipData && (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            {String(tooltipData)}
          </TooltipWithBounds>
        )}
      </>
    )
  );
};

export default AltChart;
