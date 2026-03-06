'use client';

import { ResetIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Tooltip,
} from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import useCareerParam from '@/hooks/useCareerParam';

export default function ResetButton(): React.ReactNode {
  const [level] = useCareerParam();
  const router = useRouter();

  async function handleReset(): Promise<void> {
    try {
      await router.replace(`/${level}`);
    } catch (err) {
      console.error('[ResetButton] Navigation failed after reset.', err);
    }
  }

  return (
    <AlertDialog.Root>
      <Tooltip content='Reset'>
        <AlertDialog.Trigger>
          <IconButton variant='surface' aria-label='Reset'>
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
          <AlertDialog.Action onClick={handleReset}>
            <Button>Reset</Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
