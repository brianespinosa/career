import { DataList } from '@radix-ui/themes';

interface PropertyListProps {
  properties: Record<string, string>;
  minWidth?: string;
}

const PropertyList = ({ properties, minWidth }: PropertyListProps) => {
  const entries = Object.entries(properties);

  // Calculate minimum width for labels based on the longest label if no minWidth is defined
  const labelWidth =
    minWidth ||
    entries.reduce((max, [label]) => Math.max(max, label.length), 0) * 0.5 +
      'em';

  return (
    <DataList.Root mt='4'>
      {entries.map(([label, value]) => (
        <DataList.Item key={label}>
          <DataList.Label minWidth={labelWidth}>{label}</DataList.Label>
          <DataList.Value>{value}</DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};

export default PropertyList;
