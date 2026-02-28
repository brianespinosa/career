'use client';

import type { ThemeProps } from '@radix-ui/themes';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import type { RatingKey } from '@/hooks/useRatingParam';
import { RATINGS } from '@/hooks/useRatingParam';
import { scrollToAttribute } from '@/lib/attributeId';
import type { AttributeValues } from '@/types/attributes';

type AttributeOption = Omit<AttributeValues, 'value'>;

interface OpportunitiesCardProps {
  attributeValues: AttributeOption[];
}

const OpportunitiesCard = ({ attributeValues }: OpportunitiesCardProps) => {
  const searchParams = useSearchParams();

  const rated = attributeValues
    .map((attr) => ({
      ...attr,
      rating: Number(searchParams.get(attr.param)),
    }))
    .filter(({ rating }) => rating > 0)
    .sort((a, b) => a.rating - b.rating);

  if (rated.length === 0) return null;

  return (
    <Card>
      <Heading as='h3' size='3' mb='2'>
        Opportunities
      </Heading>
      <Flex direction='column' gap='1'>
        {rated.map(({ key, name, color, rating }) => (
          <button
            key={key}
            type='button'
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
            }}
            onClick={() => scrollToAttribute(name)}
          >
            <Text
              size='2'
              color={color as ThemeProps['accentColor']}
              weight='medium'
            >
              {name}
            </Text>
            <Text size='1' color='gray' ml='2'>
              ({RATINGS[String(rating) as RatingKey]})
            </Text>
          </button>
        ))}
      </Flex>
    </Card>
  );
};

export default OpportunitiesCard;
