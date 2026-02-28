import './global.scss';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import CareerSelect from '@/components/CareerSelect';
import ResetButton from '@/components/ResetButton';

export const metadata: Metadata = {
  title: {
    template: '%s | Career Ladder',
    default: 'Career Ladder',
  },
  metadataBase: new URL('https://career.bje.co/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <meta name='robots' content='noindex,nofollow' />
      <Theme
        appearance='dark'
        accentColor='pink'
        grayColor='slate'
        radius='small'
        asChild
      >
        <body>
          <Container asChild my='6' mx='4'>
            <header>
              <Flex align='center'>
                <Heading as='h1' size='7' my='4' trim='both'>
                  Career Ladder
                </Heading>
                <Flex ml='auto' gap='2'>
                  <Suspense>
                    <CareerSelect />
                  </Suspense>
                  <Suspense>
                    <ResetButton />
                  </Suspense>
                  <Tooltip content='GitHub'>
                    <IconButton variant='surface' asChild>
                      <a href='https://github.com/brianespinosa/career'>
                        <GitHubLogoIcon />
                      </a>
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Flex>
            </header>
          </Container>
          <Container asChild my='6' mx='4'>
            <main>{children}</main>
          </Container>
        </body>
      </Theme>
    </html>
  );
}
