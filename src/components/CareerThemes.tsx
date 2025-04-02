'use client';

import { Fragment } from 'react';
import * as R from 'ramda';

import ATTRIBUTES from '@/data/attributes.json';
import EM from '@/data/em.json';
import IC from '@/data/ic.json';
import THEMES from '@/data/themes.json';
import useCareerParam from '@/hooks/useCareerParam';
import type { AttributeKeys, AttributeValues } from '@/types/attributes';
import {
  AspectRatio,
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  // Text,
  Theme,
  ThemeProps,
} from '@radix-ui/themes';

import AltChart from './AltChart';
import CareerAttribute from './CareerAttribute';
import PropertyList from './PropertyList';

const LEVELS = { ...IC, ...EM };

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

  const themeGroups = R.groupBy(R.prop('theme'), attributeValues);

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
          <Heading as='h2'>{name}</Heading>
          <PropertyList properties={properties} minWidth='8rem' />
        </Card>
        {/* <Card>
          <Text as='div' size='2' weight='bold'>
            Opportunities
          </Text>
          <Text as='div' size='2' color='gray'>
            Engineering
          </Text>
        </Card> */}
      </Flex>
      <Flex direction='column' gap='4'>
        {Object.entries(themeGroups).map(([theme, attributes]) => (
          <Fragment key={theme}>
            <Card asChild>
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
          </Fragment>
        ))}
      </Flex>
    </Grid>
  );
};

export default CareerThemes;
