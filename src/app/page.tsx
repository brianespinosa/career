import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  return (
    <PageLayout
      right={
        <Callout.Root>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Select a role level from the dropdown in the header to get started.
          </Callout.Text>
        </Callout.Root>
      }
    />
  );
}
