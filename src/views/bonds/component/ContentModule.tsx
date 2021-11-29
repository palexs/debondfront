import React from 'react';
import {
  Modal, Button, AutoComplete, Input,
} from 'antd';
import { BigNumber, Contract, utils } from 'ethers';
import styles from '../css/bonds.module.css';
import { getDisplayBalance } from '../../../eigma-cash/format_util';
import config from '../../../config';

type IMyComponentState = {
    value: string;
    isModalVisible: boolean;
    disabled: boolean;
    amount: number;
    isApprove: boolean;
    provider: any;
}
type IMyComponentProps = {
    disView: boolean,
    closeView: any,
    openView: any,
    contracts: any,
    provider: any
}
export class ContentModule extends React.Component<IMyComponentProps, IMyComponentState> {
  public provider: any;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public amount: any;

  public classa: any;

  public nonice: any;

  public orderAddress: any;

  public index: any;

  public externalTokens: any;

  public constructor(props?: any, context?: any) {
    super(props);
    this.state = {
      value: '',
      amount: 0,
      isModalVisible: false,
      disabled: true,
      isApprove: true,
      provider: this.props.provider,
    };
    const { externalTokens } = config;
    this.externalTokens = externalTokens;
    this.contracts = {};
  }

  componentDidMount() {
    this.init(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!nextProps || this.provider != nextProps.provider || this.contracts != nextProps.contracts || this.index != nextProps.index) {
      this.init(nextProps);
    }
  }

  public async init(nextProps: any) {
    if (!nextProps || !nextProps.contracts || !nextProps.provider) {
      return;
    }
    this.contracts = nextProps.contracts;
    this.provider = nextProps.provider;
    this.index = nextProps.index;
  }

  public bonds = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    const abiBond = require('../../../eigma-cash/deployments/bonds.json');
    this.contracts.bonds = new Contract(this.externalTokens.bonds[0], abiBond, this.provider);
    this.currentAddress = await this.provider.getAddress();
    const num = `${parseFloat(this.amount) * 100000}0000000000000`;
    await this.contracts.bonds.redeemBond(this.currentAddress, this.classa | 0, [this.nonice | 0], [BigNumber.from(num)]);
  };

  public setClass = (e: any) => {
    this.classa = e.currentTarget.value;
  };

  public setNonice = (e: any) => {
    this.nonice = e.currentTarget.value;
  };

  public setAmount = (e: any) => {
    this.amount = e.currentTarget.value;
  };

  public render() {
    const { value, isApprove } = this.state;
    return (
      <div>
        <Modal title="Redeem Bonds" visible={this.props.disView} footer={null} onOk={this.props.openView} onCancel={this.props.closeView}>
          <div style={{ marginLeft: ' 9%' }}>
            class:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setClass} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            noice:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setNonice} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            amount:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setAmount} />
          </div>
          <div className={styles.disButton}>

            <button className={styles.buttona} onClick={this.bonds}>Redeem Bonds</button>
          </div>

        </Modal>
      </div>
    );
  }
}
