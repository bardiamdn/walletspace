'use client';
import { RefObject } from 'react';

import styles from './style.module.scss';

type CreateProps = {
  createRef: RefObject<HTMLDivElement>;
};

export default function Create({ createRef }: CreateProps) {
  return <div className={styles.main} ref={createRef}></div>;
}
