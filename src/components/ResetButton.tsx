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

const ResetButton = () => {
  const [level] = useCareerParam();
  const router = useRouter();

  const handleReset = () => {
    router.replace(`/${level}`);
  };

  return (
    <AlertDialog.Root>
      <Tooltip content='Reset'>
        <AlertDialog.Trigger>
          <IconButton variant='surface'>
            <ResetIcon />
          </IconButton>
        </AlertDialog.Trigger>
      </Tooltip>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>Reset Ratings</AlertDialog.Title>
        <AlertDialog.Description size='2'>
          Are you sure? Your ratings will be cleared but your current career
          level will remain.
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
};

export default ResetButton;
