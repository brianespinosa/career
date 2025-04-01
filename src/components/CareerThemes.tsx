'use client';

import EM from '@/data/em.json';
import IC from '@/data/ic.json';
import useCareerParam from '@/hooks/useCareerParam';
import type { AttributeKeys } from '@/types/attributes';
import { Card, Grid, Heading } from '@radix-ui/themes';

import AltChart from './AltChart';
import CareerAttribute from './CareerAttribute';
// import CareerChart from './CareerChart';
import PropertyList from './PropertyList';

const LEVELS = { ...IC, ...EM };

const CareerThemes = () => {
  const [career] = useCareerParam();
  const { key, name, experience, attributes } = LEVELS[career];

  const properties = {
    'Radford Level': key,
    'Typical Experience': experience,
  };

  const attributeData = Object.entries(attributes) as [AttributeKeys, string][];

  return (
    <Grid
      columns={{ initial: '1', sm: 'auto 35vw', lg: 'auto 28em' }}
      gap='4'
      width='auto'
      align='start'
    >
      <Card id='role-visualization'>
        <AltChart attributes={attributeData} />
        {/* <CareerChart attributes={attributeData} /> */}
        <Heading as='h2' m='4'>
          {name}
        </Heading>
        <PropertyList properties={properties} minWidth='10rem' />
      </Card>
      <Card>
        {attributeData.map(([key, description]) => (
          <CareerAttribute
            key={key}
            attribute={key as AttributeKeys}
            description={description}
          />
        ))}
      </Card>
    </Grid>
  );
};

export default CareerThemes;
