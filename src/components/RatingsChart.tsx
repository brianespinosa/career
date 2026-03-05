'use client';

import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { ScaleSVG } from '@visx/responsive';
import { Arc } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from 'motion/react';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { RatingsContext } from '@/hooks/RatingsProvider';
import { ratingAppearAnimation } from '@/lib/animations';
import { scrollToAttribute } from '@/lib/attributeId';
import { CHART_SIZE, computeChartGeometry } from '@/lib/chartGeometry';
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

const tooltipStyles = {
  ...defaultStyles,
  background: TEXT_COLOR,
  border: '1px solid var(--gray-5)',
  color: 'var(--gray-12)',
};

const toDegrees = (x: number) => (x * 180) / Math.PI;

interface RatingsChartProps {
  themeGroups: Record<string, AttributeValues[]>;
}

const RatingsChart = ({ themeGroups }: RatingsChartProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { ratings } = useContext(RatingsContext);
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const geometries = useMemo(
    () =>
      computeChartGeometry({
        attributes: Object.values(themeGroups)
          .flat()
          .map((g) => ({
            key: g.key,
            name: g.name,
            colorName: g.color,
            value: ratings[g.param] ?? 0,
          })),
      }),
    [themeGroups, ratings],
  );

  return (
    isClient && (
      <>
        <ScaleSVG width={CHART_SIZE} height={CHART_SIZE}>
          <Group top={CHART_SIZE / 2} left={CHART_SIZE / 2}>
            {geometries.map((geo) => {
              return (
                <Fragment key={`bar-${geo.key}`}>
                  <Arc
                    cornerRadius={1}
                    startAngle={geo.startAngle}
                    endAngle={geo.endAngle}
                    outerRadius={geo.outerRadius}
                    innerRadius={geo.innerRadius}
                    fill={`var(--${geo.colorName}-6)`}
                    onClick={() => scrollToAttribute(geo.name)}
                    onPointerMove={(event) => {
                      const ownerSVGElement = (event.target as SVGElement)
                        .ownerSVGElement;
                      if (!ownerSVGElement) {
                        return; // Exit early if ownerSVGElement is null
                      }
                      const coords = localPoint(ownerSVGElement, event);
                      showTooltip({
                        tooltipData: geo.name,
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
                          {geo.rating ? (
                            <motion.path
                              fill={`var(--${geo.colorName}-6)`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => scrollToAttribute(geo.name)}
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
                    {geo.rating ? (
                      <motion.g
                        key={`text-${geo.key}`}
                        style={{
                          pointerEvents: 'none',
                          rotate: toDegrees(geo.midAngle),
                        }}
                        initial={{
                          ...ratingAppearAnimation.initial,
                          x: geo.textX,
                          y: geo.textY,
                        }}
                        animate={{
                          ...ratingAppearAnimation.animate,
                          x: geo.textX,
                          y: geo.textY,
                        }}
                        exit={{
                          ...ratingAppearAnimation.exit,
                          x: geo.textX,
                          y: geo.textY,
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
                          <AnimatedNumber value={geo.rating} />
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

export default RatingsChart;
