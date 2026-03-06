'use client';

import { Select } from '@radix-ui/themes';
import useRatingParam, { type RatingKey } from '@/hooks/useRatingParam';

interface RatingSelectProps {
  attributeParam: string;
  attributeId: string;
}

const RatingSelect = ({ attributeParam, attributeId }: RatingSelectProps) => {
  const [rating, setRating, RATINGS] = useRatingParam(attributeParam);

  return (
    <Select.Root
      size='2'
      value={rating ?? undefined}
      onValueChange={(v) => setRating(v as RatingKey)}
    >
      <Select.Trigger
        placeholder='Pick one'
        variant={rating ? 'soft' : 'surface'}
        aria-labelledby={attributeId}
      >
        {(rating && RATINGS[rating]) ?? 'Pick one'}
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
