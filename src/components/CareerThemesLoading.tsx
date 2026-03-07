import {
  AspectRatio,
  Box,
  Card,
  DataList,
  Flex,
  Heading,
  Separator,
  Skeleton,
  type ThemeProps,
} from '@radix-ui/themes';
import LoadingSpinner from './LoadingSpinner';
import PageLayout from './PageLayout';

// Order and counts mirror the actual page render order derived from attributes.json
// Counts match IC track P1–P6 (the most common user path)
const THEME_SKELETONS: {
  key: string;
  color: ThemeProps['accentColor'];
  count: number;
}[] = [
  { key: 'WHY', color: 'green', count: 2 },
  { key: 'WHAT', color: 'red', count: 7 },
  { key: 'HOW', color: 'yellow', count: 5 },
  { key: 'WHO', color: 'blue', count: 2 },
];

const AttributeRowSkeleton = () => (
  <Flex gap='4' py='3' align='center' justify='start'>
    <Flex minWidth='7rem' justify='center'>
      <Skeleton width='5rem' height='2rem' />
    </Flex>
    <Box flexGrow='1'>
      <Skeleton mb='2' width='45%' height='1.25rem' />
      <Skeleton width='85%' height='1rem' />
    </Box>
  </Flex>
);

const skeletonStyle = {
  '--gray-a3': 'color-mix(in srgb, var(--color-background) 20%, transparent)',
  '--gray-a4': 'color-mix(in srgb, var(--color-background) 50%, transparent)',
} as React.CSSProperties;

const CareerThemesLoading = () => (
  <Box style={skeletonStyle}>
    <PageLayout
      left={THEME_SKELETONS.map(({ key, color, count }) => (
        <Card key={key} asChild>
          <section>
            <Box ml='8rem'>
              <Heading as='h3' size='4' color={color}>
                {key}
              </Heading>
              <Separator my='2' size='4' color={color} />
            </Box>
            {Array.from({ length: count }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders with no identity
              <AttributeRowSkeleton key={i} />
            ))}
          </section>
        </Card>
      ))}
      right={
        <Card>
          <AspectRatio>
            <Flex align='center' justify='center' width='100%' height='100%'>
              <LoadingSpinner />
            </Flex>
          </AspectRatio>
          <Skeleton mt='4' mb='1' width='50%' height='1.75rem' />
          <DataList.Root mt='4'>
            {['Radford Level', 'Typical Experience'].map((label) => (
              <DataList.Item key={label}>
                <DataList.Label minWidth='8rem'>{label}</DataList.Label>
                <DataList.Value>
                  <Skeleton width='5rem' height='1rem' />
                </DataList.Value>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Card>
      }
    />
  </Box>
);

export default CareerThemesLoading;
