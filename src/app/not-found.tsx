import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <Flex direction='column' gap='4' align='start'>
      <Heading as='h2'>Not Found</Heading>
      <Text color='gray'>This is not the page you&apos;re looking for...</Text>
      <Button asChild>
        <Link href='/'>Go back home</Link>
      </Button>
    </Flex>
  );
}
