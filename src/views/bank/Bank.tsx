import React from 'react';
import styles from './css/bank.module.css';
import { Content } from './component/Content';

type Props = {
    provider: any
}

export const Bank = function (props: Props) {
  return (
    <div className={styles.content}>
      <div><Content provider={props.provider} /></div>
    </div>
  );
};
