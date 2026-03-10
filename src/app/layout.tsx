import './global.scss';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextLink from 'next/link';

const sinkinSans = localFont({
  src: '../fonts/SinkinSans-800Black-webfont.woff',
  weight: '800',
  display: 'swap',
  variable: '--font-sinkin-sans',
});

import HeaderControls from '@/components/HeaderControls';
import RatingsProvider from '@/hooks/RatingsProvider';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL('https://career.bje.co/'),
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<Props>): React.ReactNode {
  return (
    <html lang='en' suppressHydrationWarning className={sinkinSans.variable}>
      <meta name='robots' content='noindex,nofollow' />
      <Theme
        appearance='dark'
        accentColor='yellow'
        grayColor='slate'
        radius='small'
        asChild
      >
        <body>
          <RatingsProvider>
            <Container asChild my='6' mx='4'>
              <header>
                <Flex align='center'>
                  <Heading as='h1' size='7' my='4' trim='both'>
                    {/* style prop is intentional: Link inherits a washed-out
                        color from the Heading context. Using var(--accent-11)
                        directly is the only way to apply the correct accent
                        step without a wrapping Theme override. */}
                    <Link
                      asChild
                      highContrast
                      underline='none'
                      style={{ color: 'var(--accent-11)' }}
                    >
                      <NextLink href='/'>{SITE_TITLE}</NextLink>
                    </Link>
                  </Heading>
                  <Flex ml='auto' gap='2'>
                    <HeaderControls />
                    <Tooltip content='GitHub'>
                      <IconButton variant='soft' asChild aria-label='GitHub'>
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
          </RatingsProvider>
        </body>
      </Theme>
    </html>
  );
}
