import { PlayIcon } from '@radix-ui/react-icons';
import {
  Callout,
  Card,
  Flex,
  Heading,
  Separator,
  Text,
} from '@radix-ui/themes';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';

export default function Home() {
  return (
    <PageLayout
      left={
        <>
          <Card>
            <Flex direction='column' gap='4'>
              <Heading asChild size='4'>
                <h2>About the App</h2>
              </Heading>
              <Separator my='2' size='4' />
              <Text>
                This app supports the first two parts of a three-part career
                growth framework: rating yourself against the attributes of your
                target level, and identifying your highest-impact opportunities.
                The third part, partnering for execution with your manager or
                mentor, happens outside the app.
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction='column' gap='4'>
              <Heading asChild size='4'>
                <h2>Saving Assessments</h2>
              </Heading>
              <Separator my='2' size='4' />
              <Text>
                This app is stateless: your ratings are encoded in the URL. To
                save your assessment, paste the URL into a Slack DM to yourself.
                Apps that support link previews will unfurl it into a card
                showing your ratings chart, target level, and the date of your
                assessment, making it easy to find later. When you come back,
                your full assessment loads instantly so you can pick up where
                you left off or reuse the goal prompt without starting over.
              </Text>
              <Image
                src='https://career.bje.co/opengraph-image'
                alt='Example of a link preview card in Slack showing the ratings chart'
                width={1200}
                height={630}
                style={{ width: '100%', height: 'auto' }}
              />
            </Flex>
          </Card>
        </>
      }
      right={
        <Callout.Root>
          <Callout.Icon>
            <PlayIcon />
          </Callout.Icon>
          <Flex direction='column' gap='2'>
            <Heading asChild size='3'>
              <h3>Get Started</h3>
            </Heading>
            <Flex direction='column' gap='2' pl='4' asChild>
              <ol>
                <Text asChild size='2'>
                  <li>
                    Select your target career level from the dropdown in the
                    header.
                  </li>
                </Text>
                <Text asChild size='2'>
                  <li>
                    Rate yourself on each attribute using Never, Rarely,
                    Sometimes, or Always.
                  </li>
                </Text>
                <Text asChild size='2'>
                  <li>
                    Review the Opportunities tab to see your lowest-rated
                    attributes sorted by impact.
                  </li>
                </Text>
                <Text asChild size='2'>
                  <li>
                    Open the Goal Prompt tab and copy the generated prompt.
                  </li>
                </Text>
                <Text asChild size='2'>
                  <li>
                    Paste the prompt into any LLM (Claude, ChatGPT, etc.) to
                    craft your SMART goals for the quarter.
                  </li>
                </Text>
                <Text asChild size='2'>
                  <li>
                    Save your URL: paste it into a Slack DM to yourself so you
                    can return next quarter.
                  </li>
                </Text>
              </ol>
            </Flex>
          </Flex>
        </Callout.Root>
      }
    />
  );
}
