'use client';

import type { ThemeProps } from '@radix-ui/themes';
import { Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import type { RatingKey } from '@/hooks/useRatingParam';
import { RATINGS } from '@/hooks/useRatingParam';
import { cardFadeAnimation } from '@/lib/animations';
import { scrollToAttribute, toAttributeId } from '@/lib/attributeId';
import type { AttributeValues } from '@/types/attributes';

type AttributeOption = Omit<AttributeValues, 'value'>;

interface OpportunitiesCardProps {
  attributeValues: AttributeOption[];
}

const MotionCard = motion(Card);

const toOpacity = (rating: number, min: number, max: number): number => {
  if (min === max) return 1;
  return 1 - ((rating - min) / (max - min)) * 0.75;
};

const OpportunitiesCard = ({ attributeValues }: OpportunitiesCardProps) => {
  const searchParams = useSearchParams();

  const rated = attributeValues
    .map((attr) => ({
      ...attr,
      rating: Number(searchParams.get(attr.param)),
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

  return (
    <AnimatePresence>
      {rated.length > 0 && (
        <MotionCard key='opportunities' {...cardFadeAnimation}>
          <Heading as='h3' size='4' mb='4'>
            Opportunities
          </Heading>
          <Flex direction='column' gap='4' p='0' m='0' asChild>
            <ul>
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
        </MotionCard>
      )}
    </AnimatePresence>
  );
};

export default OpportunitiesCard;
