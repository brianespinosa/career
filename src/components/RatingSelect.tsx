'use client';

import { Select } from '@radix-ui/themes';
import useRatingParam from '@/hooks/useRatingParam';

interface RatingSelectProps {
  attributeParam: string;
}

const RatingSelect = ({ attributeParam }: RatingSelectProps) => {
  const [rating, setRating, RATINGS] = useRatingParam(attributeParam);

  return (
    <Select.Root size='2' value={rating ?? undefined} onValueChange={setRating}>
      <Select.Trigger
        placeholder='Pick one'
        variant={rating ? 'soft' : 'surface'}
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
