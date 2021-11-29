import React from 'react';
import { Modal, Input } from 'antd';
import { BigNumber, Contract, utils } from 'ethers';
import styles from '../css/gov.module.css';
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
const renderTitle = (title: string) => (
  <span>
    {title}
  </span>
);

export class Module extends React.Component<IMyComponentProps, IMyComponentState> {
  public provider: any;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public amount: any;

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
    this.init(this.props.provider);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!nextProps || this.state.provider != nextProps.provider || this.contracts != nextProps.contracts) {
      this.init(nextProps);
    }
  }

  public async init(nextProps: any) {
    if (!nextProps || !nextProps.contracts || !nextProps.provider) {
      return;
    }
    this.contracts = nextProps.contracts;
    this.provider = nextProps.provider;
    let isApprove = true;
    const abi = require('../../../eigma-cash/deployments/ERC20.json');
    this.contracts.ERC20 = new Contract(this.externalTokens.SASHTOKEN[0], abi, this.provider);
    const address = await this.provider.getAddress();
    let mount = await this.contracts.ERC20.allowance(address, this.externalTokens.bank[0]);

    mount = mount ? getDisplayBalance(mount, 1) : '0';
    if ((mount | 0) > 10000) {
      isApprove = false;
    }
    this.setState({
      isApprove,
    });
  }

  public approve = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    const abi = require('../../../eigma-cash/deployments/ERC20.json');
    if (this.provider) {
      this.contracts.ERC20 = new Contract(this.externalTokens.SASHTOKEN[0], abi, this.provider);
      const unit = '100000000000000000000000000';
      const mountIn = BigNumber.from(unit);
      const approve = await this.contracts.ERC20.approve(this.externalTokens.bank[0], mountIn);
      this.setState({
        isApprove: false,
      });
    }
  };

  public swap = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    try {
      let amount: any = parseFloat(this.amount);
      amount *= 10 ** 5;
      this.currentAddress = await this.provider.getAddress();
      amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(13));
      const mintingCost = await this.contracts.bank.buySGMBondWithSASH(this.currentAddress, amount);
    } catch (e) {
      console.error(e);
    }
  };

  public setAmount = (e: any) => {
    this.amount = e.currentTarget.value;
  };

  public render() {
    const { isApprove } = this.state;
    return (
      <div>
        <Modal title="Deposit for SASH" visible={this.props.disView} footer={null} onOk={this.props.openView} onCancel={this.props.closeView}>
          <div style={{ marginLeft: ' 12%' }}>
            amount:
            {' '}
            <Input type="number" defaultValue={0} placeholder="(Number of inputs)" style={{ width: '300px', marginBottom: '10px', height: '35px' }} className={styles.amountNmuber} onBlur={this.setAmount} />
          </div>

          <div className={styles.disButton}>
            {isApprove ? <button className={styles.buttona} onClick={this.approve}>Approve SASH</button> : null}
            <button className={styles.buttona} onClick={this.swap}>SwapAny</button>
          </div>

        </Modal>
      </div>
    );
  }
}
