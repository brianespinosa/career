'use client';

import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { ScaleSVG } from '@visx/responsive';
import { scaleBand, scaleRadial } from '@visx/scale';
import { Arc } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useRatingsMap } from '@/hooks/RatingsProvider';
import { ratingAppearAnimation } from '@/lib/animations';
import { scrollToAttribute } from '@/lib/attributeId';
import type { AttributeValues } from '@/types/attributes';

const TEXT_COLOR = 'var(--color-panel-solid)';

const AnimatedNumber = ({ value }: { value: number }) => {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useMotionValueEvent(mv, 'change', (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.3, ease: 'easeOut' });
    return controls.stop;
  }, [value, mv]);

  return <>{display || ''}</>;
};
const ATTRIBUTE_LEVELS = 4;

const SIZE = 100;
const CHART_ARC_RADIANS = 2.03 * Math.PI;

const tooltipStyles = {
  ...defaultStyles,
  background: TEXT_COLOR,
  border: '1px solid var(--gray-5)',
  color: 'var(--gray-12)',
};

const getAttribute = (d: AttributeValues) => d.key;
const getAttributeFrequency = (d: AttributeValues) => Number(d.value) * 100;
const toDegrees = (x: number) => (x * 180) / Math.PI;

interface AltChartProps {
  themeGroups: Record<string, AttributeValues[]>;
}

const AltChart = ({ themeGroups }: AltChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const ratingsMap = useRatingsMap();
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

  const enrichedGroups = Object.values(themeGroups)
    .flat()
    .map((attribute) => ({
      ...attribute,
      value: ratingsMap[attribute.param] ?? 0,
    }));

  const xDomain = useMemo(
    () => enrichedGroups.map(getAttribute),
    [enrichedGroups],
  );

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, CHART_ARC_RADIANS],
        domain: xDomain,
        padding: 0.25,
      }),
    [xDomain],
  );

  const yScale = useMemo(
    () =>
      scaleRadial<number>({
        range: [innerRadius, radiusMax],
        domain: [0, ATTRIBUTE_LEVELS * 100],
      }),
    [innerRadius, radiusMax],
  );

  return (
    isClient && (
      <>
        <ScaleSVG width={SIZE} height={SIZE}>
          <Group top={SIZE / 2} left={SIZE / 2}>
            {enrichedGroups.map((group) => {
              const attr = getAttribute(group);
              const startAngle = xScale(attr) || 0;
              const midAngle = startAngle + xScale.bandwidth() / 2;
              const endAngle = startAngle + xScale.bandwidth();

              const attributeFrequency = getAttributeFrequency(group);
              const attributeNumber = attributeFrequency / 100;

              const outerRadius = yScale(attributeFrequency) ?? 0;

              // convert polar coordinates to cartesian for drawing labels
              const textRadius = outerRadius - 8;
              const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
              const textY = textRadius * Math.sin(midAngle - Math.PI / 2);

              return (
                <Fragment key={`bar-${attr}`}>
                  <Arc
                    cornerRadius={1}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    outerRadius={outerRadius}
                    innerRadius={innerRadius}
                    fill={`var(--${group.color}-6)`}
                    onClick={() => scrollToAttribute(group.name)}
                    onPointerMove={(event) => {
                      const ownerSVGElement = (event.target as SVGElement)
                        .ownerSVGElement;
                      if (!ownerSVGElement) {
                        return; // Exit early if ownerSVGElement is null
                      }
                      const coords = localPoint(ownerSVGElement, event);
                      showTooltip({
                        tooltipData: group.name,
                        tooltipTop: (coords?.y ?? 0) + 10,
                        tooltipLeft: (coords?.x ?? 0) + 10,
                      });
                    }}
                    onMouseOut={hideTooltip}
                  >
                    {({ path }) => {
                      const d = path('color') || '';
                      return (
                        <AnimatePresence>
                          {group.value ? (
                            <motion.path
                              fill={`var(--${group.color}-6)`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => scrollToAttribute(group.name)}
                              whileHover={{ filter: 'brightness(1.3)' }}
                              whileTap={{ filter: 'brightness(0.85)' }}
                              initial={{ ...ratingAppearAnimation.initial, d }}
                              animate={{
                                ...ratingAppearAnimation.animate,
                                d,
                                filter: 'brightness(1)',
                              }}
                              exit={{ ...ratingAppearAnimation.exit, d }}
                            />
                          ) : null}
                        </AnimatePresence>
                      );
                    }}
                  </Arc>
                  <AnimatePresence>
                    {group.value ? (
                      <motion.g
                        key={`text-${attr}`}
                        style={{
                          pointerEvents: 'none',
                          rotate: toDegrees(midAngle),
                        }}
                        initial={{
                          ...ratingAppearAnimation.initial,
                          x: textX,
                          y: textY,
                        }}
                        animate={{
                          ...ratingAppearAnimation.animate,
                          x: textX,
                          y: textY,
                        }}
                        exit={{
                          ...ratingAppearAnimation.exit,
                          x: textX,
                          y: textY,
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <text
                          dominantBaseline='central'
                          textAnchor='middle'
                          fontSize='5'
                          fontWeight='bold'
                          fill={TEXT_COLOR}
                        >
                          <AnimatedNumber value={attributeNumber} />
                        </text>
                      </motion.g>
                    ) : null}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </Group>
        </ScaleSVG>
        {tooltipOpen && tooltipData && (
          <TooltipWithBounds
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
