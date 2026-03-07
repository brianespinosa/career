'use client';

import type { ThemeProps } from '@radix-ui/themes';
import { Card, Flex, Link, Tabs, Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';
import { useContext } from 'react';
import { RatingsContext } from '@/hooks/RatingsProvider';
import type { RatingKey } from '@/hooks/useRatingParam';
import { RATINGS } from '@/hooks/useRatingParam';
import { cardFadeAnimation } from '@/lib/animations';
import { scrollToAttribute, toAttributeId } from '@/lib/attributeId';
import type { AttributeValues } from '@/types/attributes';
import SmartGoalsPrompt from './SmartGoalsPrompt';

type AttributeOption = Omit<AttributeValues, 'value'>;

interface OpportunitiesCardProps {
  attributeValues: AttributeOption[];
  levelKey: string;
  levelName: string;
}

const MotionCard = motion(Card);

const toOpacity = (rating: number, min: number, max: number): number => {
  if (min === max) return 1;
  return 1 - ((rating - min) / (max - min)) * 0.75;
};

const OpportunitiesCard = ({
  attributeValues,
  levelKey,
  levelName,
}: OpportunitiesCardProps) => {
  const { ratings } = useContext(RatingsContext);

  const rated = attributeValues
    .map((attr) => ({
      ...attr,
      rating: ratings[attr.param] ?? 0,
    }))
    .filter(({ rating }) => rating > 0)
    .sort((a, b) => a.rating - b.rating);

  const lowestRating = rated.length > 0 ? rated[0].rating : 0;
  const highestRating = rated.length > 0 ? rated[rated.length - 1].rating : 0;
  const hasMultipleLevels = lowestRating !== highestRating;

  const visible = hasMultipleLevels
    ? rated.filter(({ rating }) => rating !== highestRating)
    : rated;

  const minRating = visible.length > 0 ? visible[0].rating : 0;
  const maxRating = visible.length > 0 ? visible[visible.length - 1].rating : 0;

  const themeGroups = Object.entries(
    Object.groupBy(visible, (attr) => attr.theme),
  ).map(([theme, attrs]) => ({
    theme,
    attributes: (attrs ?? []).map((a) => ({
      name: a.name,
      description: a.description,
    })),
  }));

  return (
    <AnimatePresence>
      {rated.length > 0 && (
        <MotionCard key='opportunities' {...cardFadeAnimation}>
          <Tabs.Root defaultValue='opportunities'>
            <Tabs.List mb='4'>
              <Tabs.Trigger value='opportunities'>Opportunities</Tabs.Trigger>
              <Tabs.Trigger value='goal-prompt'>Goal Prompt</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value='opportunities'>
              <Flex direction='column' gap='4' p='0' m='0' asChild>
                <ul className='list-none'>
                  <AnimatePresence>
                    {visible.map(({ key, name, color, rating }) => (
                      <motion.li
                        key={key}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: toOpacity(rating, minRating, maxRating),
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 0.6 } }}
                      >
                        <Link
                          href={`#${toAttributeId(name)}`}
                          color={color as ThemeProps['accentColor']}
                          size='2'
                          weight='medium'
                          underline='hover'
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToAttribute(name);
                          }}
                        >
                          {name}
                          <Text as='span' size='1' color='gray' ml='2'>
                            ({RATINGS[String(rating) as RatingKey]})
                          </Text>
                        </Link>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value='goal-prompt'>
              <SmartGoalsPrompt
                levelKey={levelKey}
                levelName={levelName}
                themeGroups={themeGroups}
              />
            </Tabs.Content>
          </Tabs.Root>
        </MotionCard>
      )}
    </AnimatePresence>
  );
};

export default OpportunitiesCard;
