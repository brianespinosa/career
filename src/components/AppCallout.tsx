import { Callout } from '@radix-ui/themes';

const AppCallout = ({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Callout.Root>, 'variant'>) => (
  <Callout.Root variant='outline' size='1' {...props}>
    <Callout.Text>{children}</Callout.Text>
  </Callout.Root>
);

export default AppCallout;
