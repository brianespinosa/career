'use client';

import { Select } from '@radix-ui/themes';
import EM from '@/data/em.json';
import EMML from '@/data/em-ml.json';
import IC from '@/data/ic.json';
import ICML from '@/data/ic-ml.json';
import useCareerParam from '@/hooks/useCareerParam';
import type { LevelDetails, LevelKeys, LevelRecord } from '@/types/levels';

const getLabel = ({ name, key }: LevelDetails) => `[${key}] ${name}`;

const renderOptions = (obj: LevelRecord) =>
  Object.entries(obj).map(([key, obj]) => (
    <Select.Item key={key} value={key}>
      {getLabel(obj)}
    </Select.Item>
  ));

const CareerSelect = () => {
  const [career, setCareer] = useCareerParam();
  return (
    <Select.Root
      value={career ?? ''}
      onValueChange={(v) => setCareer(v as LevelKeys)}
    >
      <Select.Trigger
        variant='soft'
        aria-label='Career level'
        placeholder='Select level...'
      />
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
        <Select.Separator />
        <Select.Group>
          <Select.Label>IC ML</Select.Label>
          {renderOptions(ICML)}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>EM ML</Select.Label>
          {renderOptions(EMML)}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default CareerSelect;
