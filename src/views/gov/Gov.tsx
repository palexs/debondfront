import React from 'react';

import Web3 from 'web3';
import { Content } from './component/Content';
import styles from './css/gov.module.css';

type IMyComponentState = {
  value: string;
  isModalVisible: boolean;
  disabled: boolean;
  amount: number;
}
type IMyComponentProps = {
  provider: any,
  web3: Web3 | null,
}

export class Gov extends React.Component<IMyComponentProps, IMyComponentState> {
  public tree: any;

  public list: Array<any>;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public constructor(props?: any, context?: any) {
    super(props);
    this.state = {
      value: '',
      amount: 0,
      isModalVisible: false,
      disabled: true,
    };
    this.list = [];
    this.contracts = {};
  }

  public render() {
    const { isModalVisible, disabled } = this.state;
    return (
      <div>
        <div className={styles.content}><Content provider={this.props.provider} web3={this.props.web3} /></div>
      </div>
    );
  }
}
