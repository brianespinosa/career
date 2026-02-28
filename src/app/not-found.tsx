import type { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <h2>Not Found</h2>
      <p>This is not the page you&apos;re looking for...</p>
      <NextLink href='/'>Go back home</NextLink>
    </main>
  );
}
