import styles from './page.module.css';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Ladder',
};

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Career Ladder</h1>
    </div>
  );
}
