'use client';

import ATTRIBUTES from '@/data/attributes.json';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

import RatingSelect from './RatingSelect';

interface CarrerAttributesProps {
  attribute: keyof typeof ATTRIBUTES;
  description: string;
}

const CareerAttribute = ({ attribute, description }: CarrerAttributesProps) => {
  const { param, name } = ATTRIBUTES[attribute];

  return (
    <>
      <Flex gap='8' m='4' py='4' align='center' justify='start'>
        <Box minWidth='8.25rem'>
          <RatingSelect attributeParam={param} />
        </Box>
        <Box>
          <Heading
            as='h4'
            size='4'
            mb='2'
            id={name.toLowerCase().split(' ').join('-')}
          >
            {name}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Flex>
    </>
  );
};

export default CareerAttribute;
