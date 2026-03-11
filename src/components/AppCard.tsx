import { Card } from '@radix-ui/themes';

const AppCard = ({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Card>, 'asChild'>) => (
  <Card asChild {...props}>
    <section>{children}</section>
  </Card>
);

export default AppCard;
