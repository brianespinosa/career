'use client';

import { Dispatch, SetStateAction } from 'react';

import useRatingParam from '@/hooks/useRatingParam';
import { Select } from '@radix-ui/themes';

interface RatingSelectProps {
  attributeParam: string;
}

const RatingSelect = ({ attributeParam }: RatingSelectProps) => {
  const [rating, setRating, RATINGS] = useRatingParam(attributeParam);

  return (
    <Select.Root
      size='2'
      value={rating as keyof typeof RATINGS} // TODO: Move this type assertion to useRatingParam
      onValueChange={setRating as Dispatch<SetStateAction<string>>} // TODO: Move this type assertion to useRatingParam
    >
      <Select.Trigger
        placeholder='Pick one'
        variant={rating ? 'soft' : 'surface'}
      >
        {RATINGS[rating as keyof typeof RATINGS] ?? 'Pick one'}
      </Select.Trigger>
      <Select.Content>
        {Object.entries(RATINGS).map(([key, value]) => (
          <Select.Item key={key} value={key}>
            {value}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default RatingSelect;
