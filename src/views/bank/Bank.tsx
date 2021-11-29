import React from 'react';
import styles from '@views/bank/css/bank.module.css';
import { Content } from './component/Content';

type IMyComponentState = {
    value: string;
    isModalVisible: boolean;
    disabled: boolean;
    amount: number;
}
type IMyComponentProps = {
    provider: any
}

export class Bank extends React.Component<IMyComponentProps, IMyComponentState> {
  public tree: any;

  public list: Array<any>;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public _context: any;

  public constructor(props?: any, context?: any) {
    super(props);
    this._context = context;
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
    return (
      <div className={styles.content}>
        <div><Content provider={this.props.provider} /></div>
      </div>
    );
  }
}
