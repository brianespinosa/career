'use client';

import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Separator,
  Theme,
  type ThemeProps,
} from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ATTRIBUTES from '@/data/attributes.json';
import THEMES from '@/data/themes.json';
import useCareerParam from '@/hooks/useCareerParam';
import { LEVELS } from '@/lib/levels';
import type { AttributeKeys, AttributeValues } from '@/types/attributes';
import type { LevelKeys } from '@/types/levels';
import AppCard from './AppCard';
import CareerAttribute from './CareerAttribute';
import LoadingSpinner from './LoadingSpinner';
import PageLayout from './PageLayout';
import PropertyList from './PropertyList';

const RatingsChart = dynamic(() => import('./RatingsChart'), {
  ssr: false,
  loading: () => (
    <Flex align='center' justify='center' width='100%' height='100%'>
      <LoadingSpinner />
    </Flex>
  ),
});
const OpportunitiesCard = dynamic(() => import('./OpportunitiesCard'), {
  ssr: false,
});

const CareerThemes = () => {
  const [career] = useCareerParam();
  const { key, name, experience, attributes } = LEVELS[career as LevelKeys];

  const properties = {
    'Radford Level': key,
    'Typical Experience': experience,
  };

  const attributeValues = Object.values(ATTRIBUTES)
    .map((attribute) => ({
      ...attribute,
      description: (attributes as Record<string, string>)[attribute.key],
      color: THEMES[attribute.theme as keyof typeof THEMES].color,
    }))
    .filter(({ description }) => description !== undefined);

  const themeGroups = Object.groupBy(attributeValues, (attr) => attr.theme);

  return (
    <PageLayout
      leftId='role-visualization'
      left={
        <>
          <AppCard>
            <AspectRatio>
              <RatingsChart
                themeGroups={themeGroups as Record<string, AttributeValues[]>}
              />
            </AspectRatio>

            <Heading as='h2' mt='4'>
              {name}
            </Heading>
            <PropertyList properties={properties} minWidth='8rem' />
          </AppCard>
          <Suspense>
            <OpportunitiesCard
              attributeValues={attributeValues}
              levelKey={key}
              levelName={name}
            />
          </Suspense>
        </>
      }
      right={Object.entries(themeGroups).map(([theme, attributes]) => (
        <AppCard key={theme}>
          <Box ml='8rem'>
            <Heading
              as='h3'
              size='4'
              color={attributes?.[0].color as ThemeProps['accentColor']}
            >
              {theme}
            </Heading>
            <Separator
              my='2'
              size='4'
              color={attributes?.[0].color as ThemeProps['accentColor']}
            />
          </Box>
          {attributes?.map(({ key, description, color }) => (
            <Theme key={key} accentColor={color as ThemeProps['accentColor']}>
              <CareerAttribute
                attribute={key as AttributeKeys}
                description={description}
              />
            </Theme>
          ))}
        </AppCard>
      ))}
    />
  );
};

export default CareerThemes;
