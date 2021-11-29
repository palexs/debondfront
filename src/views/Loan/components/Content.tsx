import React, { Component } from 'react';
import { Input, notification } from 'antd';
import { BigNumber, Contract } from 'ethers';
import { WarningOutlined } from '@ant-design/icons';
import MyModal from '../../../components/Modal/Index';
import ApproveModal from './ApproveModal';
import TradingInterface from '../../../components/TradingInterface/TradingInterface';
import buySashBond from '../../bank/css/buySashBond.module.css';
import styles from '../css/loan.module.css';
// import BondsTest from "../../../eigma-cash/deployments/bondsTest.json";
import dexTest from '../../../eigma-cash/deployments/dexTest.json';
import TestToken from '../../../eigma-cash/deployments/TestToken.json';
import config from '../../../config-production';
import particle from '../../../assets/particle.gif';
import trian from '../../../assets/trian.png';
import cir1 from '../../../assets/circ1.png';

const LOANABI = require('../../../eigma-cash/testAbi/LOAN.json');

type ContentProps = {
  provider:any
}

type ContentState = {
  modalStatus: boolean
  approveModalStatus: boolean
  currencyType:string
  stepSize:number
  startingPrice: number
  endingPrice: number
  maxAmount: number
  dueDate: number
  interestRate: number
  currencyIndex: number
  lastDays: number
  spinning: boolean
  isApprove: boolean
  minAmount:number,
  auctionType:number
}

class Content extends Component<ContentProps, ContentState> {
  private bank: any;

  private address: string = config.externalTokens.dexTest[0];

  private bondAddress: any = config.externalTokens.bondsTest[0];

  private Child: any;

  private loan:any;

  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
    this.Child = React.createRef();
    this.state = {
      modalStatus: true,
      approveModalStatus: false,
      currencyType: 'USDT',
      currencyIndex: 0,
      stepSize: 0,
      startingPrice: 0,
      endingPrice: 0,
      maxAmount: 0,
      dueDate: 0,
      interestRate: 0,
      lastDays: 0,
      spinning: false,
      isApprove: false,
      minAmount: 0,
      auctionType: 1,
    };
  }

  public handleModalStatus = () => {
    this.setState({
      modalStatus: !this.state.modalStatus,
    });
  };

  public setSpinning = (status: boolean) => {
    this.setState({
      spinning: status,
    });
  };

  public handleRefresh = () => {
  };

  /**
   * Handle input list switching function
   * */
  public handleCurrency = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, i: number, type: string) => {
    this.setState({
      currencyType: type,
      currencyIndex: i,
    });
  };

  /**
   * The function of processing the slider to change the data
   * */
  public handleRangeChange = (val: any) => {
    this.setState({
      stepSize: val,
    });
  };

  public handlePrice = (type: string, val: number) => {
    if (type === 'max') {
      this.setState({
        startingPrice: val,
      });
    } else {
      this.setState({
        endingPrice: val,
      });
    }
  };

  public approve = async () => {
    const currentAddress = await this.props.provider.getAddress();
    if (!currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description: 'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
      return;
    }
    const abi = require('../../../eigma-cash/deployments/TestToken.json');
    if (this.props.provider && currentAddress) {
      const ERC20 = new Contract(currentAddress, abi, this.props.provider);
      const unit = '100000000000000000000000000';
      const mountIn = BigNumber.from(unit);
      const approve = await ERC20.approve(this.address, mountIn);
      this.setState({
        isApprove: true,
      });
    }
  };

  /* public createLoan = async () => {
    if (!this.props.provider) {
      alert("No Wallet connected!");
      return;
    }
    var data = {} as any;
    const timestamp = Date.now()
    const currentAddress = await this.props.provider.getAddress();

    data["seller"] = currentAddress;
    data["startingPrice"] = BigNumber.from(this.state.startingPrice).toNumber();
    data["endingPrice"] = BigNumber.from(this.state.endingPrice).toNumber();
    data["auctionTimestamp"] = 10000;
    data["auctionDuration"] = BigNumber.from(this.state.lastDays).mul(12).mul(60).mul(60).toNumber();
    data["bondAddress"] = this.bondAddress;
    data["interestRate"] = this.state.interestRate;
    data["loanDuration"] = BigNumber.from(this.state.dueDate).mul(12).mul(60).mul(60).toNumber();
    data["bondClass"] = [0];
    data["bondNonce"] = [0];
    data["bondAmount"] = this.state.stepSize;
    this.bank = new Contract(this.address, dexTest, this.props.provider)
    await this.bank.isActive(true)
    const isActive = await this.bank.contract_is_active();
    !isActive && await this.bank.isActive(true);
    const bondContract = await this.bank.bond_contract()
    bondContract !== this.bondAddress && await this.bank.setBondContract(this.bondAddress)
    let a = [
      data.seller, //
      data.startingPrice, // max Value
      data.endingPrice, // min Value
      // data.auctionTimestamp, // timestamp
      data.auctionDuration, // DUE DATE
      // data.bondAddress, // BOND ADDRESS
      data.interestRate, // interestRate
      data.loanDuration, // 接待持续时间
      // data.bondClass,
      // data.bondNonce, // Nonce
      data.bondAmount, // bondAmount
      config.externalTokens.TokenAddress,
    ]

    const res = await this.bank.createERC20Loan(
        data.seller, //
        data.startingPrice, // max Value
        data.endingPrice, // min Value
        // data.auctionTimestamp, // timestamp
        data.auctionDuration, // DUE DATE
        // data.bondAddress, // BOND ADDRESS
        data.interestRate, // The interest rate
        data.loanDuration, // Reception duration
        // data.bondClass, // Token index Indicates the token index
        // data.bondNonce, // Nonce
        data.bondAmount, // The mortgage amount
        "0x0b85692a66ff158c125174d884ab4a0633c592b6"
    );
  } */ public createLoan = async () => {
    if (!this.props.provider) {
      alert('No Wallet connected!');
      return;
    }
    const data = {} as any;
    const currentAddress = await this.props.provider.getAddress();
    data.seller = currentAddress;
    data.startingPrice = BigNumber.from(this.state.startingPrice).toNumber();
    data.endingPrice = BigNumber.from(this.state.endingPrice).toNumber();
    data.auctionDuration = BigNumber.from(this.state.lastDays).mul(12).mul(60).mul(60)
      .toNumber();
    data.interestRate = this.state.interestRate;
    data.loanDuration = BigNumber.from(this.state.dueDate).mul(12).mul(60).mul(60)
      .toNumber();
    data.auctionType = 1;
    data.assetsName = this.state.currencyType;
    data.amount = this.state.stepSize;
    this.loan = new Contract(config.testAddress.Loan[0], LOANABI, this.props.provider);

    const res = await this.loan.createLoan(
      data.auctionType, //
      data.seller, // max Value
      data.startingPrice, // min Value
      // data.auctionTimestamp, // timestamp
      data.endingPrice, // DUE DATE
      // data.bondAddress, // BOND ADDRESS
      data.auctionDuration, // The interest rate
      data.loanDuration, // Reception duration
      data.interestRate,
      data.assetsName, // Token index Indicates the token index
      // data.bondNonce, // Nonce
      data.amount, // The mortgage amount
    );
    this.setState({
      modalStatus: false,
      approveModalStatus: false,
    });
  };

  public borrow = async (data: any) => {
    this.setState({
      maxAmount: data.max,
      dueDate: data.dueDate,
      interestRate: data.interestRate,
      minAmount: data.min,
      auctionType: data.auctionType,
    });
    this.handleApproveStatusChange();
    // await this.createLoan()
  };

  public submit = async (days: number) => {
    this.setState({
      lastDays: days,
    });
    await this.createLoan();
  };

  public handleApproveStatusChange = () => {
    this.setState({
      modalStatus: !this.state.modalStatus,
      approveModalStatus: !this.state.approveModalStatus,
    });
  };

  public refresh = async () => {
    this.setSpinning(true);
    await this.Child.current.getInputData();
    this.setSpinning(false);
  };

  render() {
    const { state } = this;
    return (
      <div>
        <h1 className={styles.title}>LOAN</h1>
        <div className={styles.img_container}>
          <div className={styles.img_base}>
            <img src={particle} width="320px" height="320px" alt="" />
            <div className={styles.img_1} />
            <div className={styles.img_3}>
              <img src={trian} width="10px" height="10px" alt="" />
            </div>
          </div>
        </div>

        <ApproveModal
          visible={this.state.approveModalStatus}
          onSave={this.submit}
          isApprove={this.state.isApprove}
          approve={this.approve}
          onCancle={this.handleApproveStatusChange}
        />
        <MyModal visible={state.modalStatus} onCancel={this.handleModalStatus} spinning={this.state.spinning} refresh={this.refresh} title="LOAN">
          <TradingInterface
            type="loan"
            ref={this.Child}
            provider={this.props.provider}
            currencyType={this.state.currencyType}
            changeCurrency={this.handleCurrency}
            rangeChange={this.handleRangeChange}
            onBorrow={this.borrow}
            onPriceChange={this.handlePrice}
            stepSize={this.state.stepSize}
            refresh
          >
            <span className={`${buySashBond.money} ${buySashBond.block}`}>(IN USD $ 16524.12)</span>
            <span className={`${buySashBond.proportion} ${buySashBond.block}`}>
              { (this.state.stepSize / 100).toFixed(2) }
              %
            </span>
            <Input
              size="small"
              suffix={this.state.currencyType}
              value={this.state.stepSize}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (isNaN(val)) e.target.value = String(0);
                if (Number(e.target.value) > 100) e.target.value = String(100);
                if (Number(e.target.value) < 0) e.target.value = String(0);
                this.setState({ stepSize: Number(e.target.value) });
              }}
            />
          </TradingInterface>
        </MyModal>
      </div>
    );
  }
}

export default Content;
