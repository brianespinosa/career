import './global.scss';

import type { Metadata } from 'next';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import CareerSelect from '@/components/CareerSelect';
import {
  AlertDialog,
  Button,
  Container,
  Flex,
  Heading,
  Theme,
} from '@radix-ui/themes';

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
      <NuqsAdapter>
        <Theme
          appearance='dark'
          accentColor='purple'
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
                    <CareerSelect />

                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <Button variant='outline'>Reset</Button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content maxWidth='450px'>
                        <AlertDialog.Title>Reset Ratings</AlertDialog.Title>
                        <AlertDialog.Description size='2'>
                          Are you sure? Your ratings and career level will be
                          removed but your current career rating will remain in
                          browser history.
                        </AlertDialog.Description>

                        <Flex gap='3' mt='4' justify='end'>
                          <AlertDialog.Cancel>
                            <Button variant='outline' color='gray'>
                              Cancel
                            </Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button asChild>
                              <Link href='/'>Reset</Link>
                            </Button>
                          </AlertDialog.Action>
                        </Flex>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </Flex>
                </Flex>
              </header>
            </Container>
            <Container asChild my='6' mx='4'>
              <main>{children}</main>
            </Container>
            {/* <ThemePanel /> */}
          </body>
        </Theme>
      </NuqsAdapter>
    </html>
  );
}
