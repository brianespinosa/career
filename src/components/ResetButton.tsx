'use client';

import { ResetIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Tooltip,
} from '@radix-ui/themes';
import { useContext } from 'react';
import { RatingsContext } from '@/hooks/RatingsProvider';

export default function ResetButton(): React.ReactNode {
  const { ratings, clearRatings } = useContext(RatingsContext);
  const disabled = Object.keys(ratings).length === 0;

  return (
    <AlertDialog.Root>
      <Tooltip content='Reset'>
        <AlertDialog.Trigger disabled={disabled}>
          <IconButton variant='surface' aria-label='Reset' disabled={disabled}>
            <ResetIcon />
          </IconButton>
        </AlertDialog.Trigger>
      </Tooltip>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>Reset Ratings</AlertDialog.Title>
        <AlertDialog.Description size='2'>
          Are you sure? Your ratings will be cleared but your current career
          level will remain in browser history.
        </AlertDialog.Description>

        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='surface' color='gray'>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={clearRatings}>
            <Button>Reset</Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
