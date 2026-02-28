'use client';

import { Select } from '@radix-ui/themes';
import EM from '@/data/em.json';
import IC from '@/data/ic.json';
import useCareerParam from '@/hooks/useCareerParam';
import type { LevelDetails, LevelRecord } from '@/types/levels';

const LEVELS = { ...IC, ...EM };

const getLabel = ({ name, key }: LevelDetails) => `[${key}] ${name}`;

const renderOptions = (obj: LevelRecord) =>
  Object.entries(obj).map(([key, obj]) => (
    <Select.Item key={key} value={key}>
      {getLabel(obj)}
    </Select.Item>
  ));

const CareerSelect = () => {
  const [career, setCareer] = useCareerParam();

  const selectedLevelObj = LEVELS[career];

  return (
    <Select.Root value={career} onValueChange={setCareer}>
      <Select.Trigger variant='soft'>
        {getLabel(selectedLevelObj)}
      </Select.Trigger>
      <Select.Content position='popper'>
        <Select.Group>
          <Select.Label>IC</Select.Label>
          {renderOptions(IC)}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>EM</Select.Label>
          {renderOptions(EM)}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default CareerSelect;
