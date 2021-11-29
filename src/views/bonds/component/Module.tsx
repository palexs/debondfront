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
export class Module extends React.Component<IMyComponentProps, IMyComponentState> {
  public provider: any;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public amount: any;

  public startingPrice: any;

  public auctionTimestamp: any;

  public auctionDuration: any;

  public bondClass: any;

  public bondNonce: any;

  public bondAmount: any;

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
    if (!nextProps || this.provider != nextProps.provider || this.contracts != nextProps.contracts) {
      this.init(nextProps);
    }
  }

  public async init(nextProps: any) {
    if (!nextProps || !nextProps.contracts || !nextProps.provider) {
      return;
    }
    this.contracts = nextProps.contracts;
    this.provider = nextProps.provider;
  }

  public order = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    this.currentAddress = await this.provider.getAddress();
    const abi = require('../../../eigma-cash/deployments/dex.json');
    this.contracts.dex = new Contract(this.externalTokens.dex[0], abi, this.provider);
    const objs = {} as any;
    objs.auctionStatut = true;
    objs.seller = this.currentAddress;
    objs.startingPrice = this.startingPrice | 0;
    objs.auctionTimestamp = this.auctionTimestamp | 0;
    objs.auctionDuration = this.auctionDuration | 0;
    objs.bondAddress = this.externalTokens.bonds[0];
    objs.bondClass = [this.bondClass | 0];
    objs.bondNonce = [this.bondNonce | 0];
    const num = `${parseFloat(this.bondAmount) * 100000}0000000000000`;
    objs.bondAmount = [BigNumber.from(num)];
    const ce = await this.contracts.dex.addAuction(objs);
  };

  public setstartingPrice = (e: any) => {
    this.startingPrice = e.currentTarget.value;
  };

  public setauctionTimestamp = (e: any) => {
    this.auctionTimestamp = e.currentTarget.value;
  };

  public setauctionDuration = (e: any) => {
    this.auctionDuration = e.currentTarget.value;
  };

  public setbondClass = (e: any) => {
    this.bondClass = e.currentTarget.value;
  };

  public setbondNonce = (e: any) => {
    this.bondNonce = e.currentTarget.value;
  };

  public setbondAmount = (e: any) => {
    this.bondAmount = e.currentTarget.value;
  };

  public render() {
    const { value, isApprove } = this.state;
    return (
      <div>
        <Modal title="Deposit for SASH" visible={this.props.disView} footer={null} onOk={this.props.openView} onCancel={this.props.closeView}>
          <div style={{ marginLeft: ' 9%' }}>
            startingPrice:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setstartingPrice} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            auctionTimestamp:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setauctionTimestamp} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            auctionDuration:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setauctionDuration} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            bondClass:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setbondClass} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            bondNonce:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setbondNonce} />
          </div>
          <div style={{ marginLeft: ' 9%' }}>
            bondAmount:
            {' '}
            <Input type="text" placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setbondAmount} />
          </div>
          <div className={styles.disButton}>

            <button className={styles.buttona} onClick={this.order}>Create Order</button>
          </div>

        </Modal>
      </div>
    );
  }
}
