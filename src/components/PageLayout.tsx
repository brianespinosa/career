import { Flex, Grid } from '@radix-ui/themes';

interface PageLayoutProps {
  left?: React.ReactNode;
  right: React.ReactNode;
  leftId?: string;
}

const PageLayout = ({ left, right, leftId }: PageLayoutProps) => (
  <Grid
    columns={{
      initial: '1',
      sm: 'calc(100% - 32vw - var(--space-4)) 32vw',
      lg: 'calc(100% - 25em - var(--space-4)) 25em',
    }}
    gap='4'
    width='auto'
    align='start'
  >
    <Flex id={leftId} direction='column' gap='4'>
      {left}
    </Flex>
    <Flex direction='column' gap='4'>
      {right}
    </Flex>
  </Grid>
);

export default PageLayout;
