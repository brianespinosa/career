import { Card } from '@radix-ui/themes';

const AppCard = ({
  children,
  as: Element = 'section',
  ...props
}: Omit<React.ComponentProps<typeof Card>, 'asChild'> & {
  as?: React.ElementType;
}) => (
  <Card asChild {...props}>
    <Element>{children}</Element>
  </Card>
);

export default AppCard;
