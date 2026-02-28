import { redirect } from 'next/navigation';

import { LEVELS } from '@/lib/levels';

export default function Home() {
  redirect(`/${Object.keys(LEVELS)[0]}`);
}
