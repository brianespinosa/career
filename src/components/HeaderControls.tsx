'use client';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { IconButton, Tooltip } from '@radix-ui/themes';
import { track } from '@vercel/analytics';
import CareerSelect from './CareerSelect';
import ResetButton from './ResetButton';

export default function HeaderControls(): React.ReactNode {
  return (
    <>
      <CareerSelect />
      <ResetButton />
      <Tooltip content='GitHub'>
        <IconButton variant='soft' asChild aria-label='GitHub'>
          <a
            href='https://github.com/brianespinosa/career'
            onClick={() => track('github_link_click')}
          >
            <GitHubLogoIcon />
          </a>
        </IconButton>
      </Tooltip>
    </>
  );
}
