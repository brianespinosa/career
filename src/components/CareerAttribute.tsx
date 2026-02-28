'use client';

import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import ATTRIBUTES from '@/data/attributes.json';

import RatingSelect from './RatingSelect';

interface CareerAttributeProps {
  attribute: keyof typeof ATTRIBUTES;
  description: string;
}

const CareerAttribute = ({ attribute, description }: CareerAttributeProps) => {
  const { param, name } = ATTRIBUTES[attribute];

  return (
    <Flex gap='4' py='3' align='center' justify='start'>
      <Flex minWidth='7rem' justify='center'>
        <RatingSelect attributeParam={param} />
      </Flex>
      <Box>
        <Heading
          as='h4'
          size='4'
          mb='2'
          id={name.toLowerCase().split(' ').join('-')}
        >
          {name}
        </Heading>
        <Text size='2' color='gray'>
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default CareerAttribute;
