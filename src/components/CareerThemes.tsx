'use client';

import {
  AspectRatio,
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Theme,
  type ThemeProps,
} from '@radix-ui/themes';
import { Suspense } from 'react';
import ATTRIBUTES from '@/data/attributes.json';
import THEMES from '@/data/themes.json';
import useCareerParam from '@/hooks/useCareerParam';
import { LEVELS } from '@/lib/levels';
import type { AttributeKeys, AttributeValues } from '@/types/attributes';

import AltChart from './AltChart';
import CareerAttribute from './CareerAttribute';
import OpportunitiesCard from './OpportunitiesCard';
import PropertyList from './PropertyList';

const CareerThemes = () => {
  const [career] = useCareerParam();
  const { key, name, experience, attributes } = LEVELS[career];

  const properties = {
    'Radford Level': key,
    'Typical Experience': experience,
  };

  const attributeValues = Object.values(ATTRIBUTES)
    .map((attribute) => ({
      ...attribute,
      description: attributes[attribute.key as keyof typeof attributes],
      color: THEMES[attribute.theme as keyof typeof THEMES].color,
    }))
    .filter(({ description }) => description !== undefined);

  const themeGroups = Object.groupBy(attributeValues, (attr) => attr.theme);

  return (
    <Grid
      columns={{ initial: '1', sm: 'auto 32vw', lg: 'auto 25em' }}
      gap='4'
      width='auto'
      align='start'
    >
      <Flex id='role-visualization' direction='column' gap='4'>
        <Card>
          <AspectRatio>
            <AltChart
              themeGroups={themeGroups as Record<string, AttributeValues[]>}
            />
          </AspectRatio>
          <Heading as='h2' mt='4'>
            {name}
          </Heading>
          <PropertyList properties={properties} minWidth='8rem' />
        </Card>
        <Suspense>
          <OpportunitiesCard attributeValues={attributeValues} />
        </Suspense>
      </Flex>
      <Flex direction='column' gap='4'>
        {Object.entries(themeGroups).map(([theme, attributes]) => (
          <Card key={theme} asChild>
            <section>
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
                <Theme
                  key={key}
                  accentColor={color as ThemeProps['accentColor']}
                >
                  <CareerAttribute
                    attribute={key as AttributeKeys}
                    description={description}
                  />
                </Theme>
              ))}
            </section>
          </Card>
        ))}
      </Flex>
    </Grid>
  );
};

export default CareerThemes;
