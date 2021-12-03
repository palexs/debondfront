import React, { Component } from 'react';
import axios from 'axios';
import { BigNumber, Contract, utils } from 'ethers';
import { notification, Input } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import MyModal from '../../../components/Modal/Index';
import { getDisplayBalance, getBalance, handleBalance } from '../../../eigma-cash/format_util';
import config from '../../../config-production';
import BalanceTree from '../tree/balance-tree';
import { Module } from './Module';
import styles from '../css/bank.module.css';
import buySashBond from '../css/buySashBond.module.css';
import cir from '../../../assets/cir.png';
import cir1 from '../../../assets/circ1.png';
import particle from '../../../assets/particle.gif';
import TradingInterface from '../../../components/TradingInterface/TradingInterface';
import ClaimAirdrop from '../../../components/ClaimAirdrop/ClaimAirdrop';
import Deposit from '../../../components/Deposit/Deposit';

const abiERC20 = require('../../../eigma-cash/deployments/ERC20.json');
const abiSASHTOKEN = require('../../../eigma-cash/deployments/SASHTOKEN.json');
const abiRouter = require('../../../eigma-cash/deployments/uniswapRouter.json');
const abiBank = require('../../../eigma-cash/deployments/bank.json');
const abiClaim = require('../../../eigma-cash/deployments/claim.json');

type State = {
  value: string;
  isModalVisible: boolean;
  disIsModal: boolean;
  disabled: boolean;
  amount: any;
  currentPrice: string;
  totalSupply: string;
  mintingCost: string;
  provider: any,
  visible: boolean
  stepSize: number,
  currencyType: string,
  balance: number,
  allBalance: any,
  sashModalStatus: boolean,
  depositStatus: boolean,
  isApprove: boolean,
  currAddress:string,
  bondSpinning: boolean,
  depositType:string
}
type Props = {
  provider: any
}

// const windowNew = window as any;/
export class Content extends Component<Props, State> {
  static getCurrentAddressData = (address: string, list: string[]): {
    index: number, amount: string, address: string,
  } | null => {
    const count = list ? list.length : 0;
    for (let i = 0; i < count; i++) {
      const unit = list[i];
      const childList = unit.split(/,/g);
      if (address === childList[4]) {
        return {
          index: i, // childList[0],
          amount: childList[5].trim(),
          address: childList[4],
        };
        break;
      }
    }
    return null;
  };

  provider: any;

  list: any[];

  contracts: any;

  currentAddress?: string;

  externalTokens: any;

  private Child: any;

  constructor(props: any) {
    super(props);
    this.Child = React.createRef();
    this.state = {
      value: '',
      amount: 0,
      isModalVisible: false,
      disIsModal: false,
      disabled: true,
      currentPrice: '',
      totalSupply: '',
      mintingCost: '',
      provider: this.props.provider,
      visible: false,
      stepSize: 0,
      currencyType: 'USDT',
      balance: 0,
      allBalance: 0,
      sashModalStatus: false,
      depositStatus: false,
      isApprove: true,
      currAddress: '',
      bondSpinning: false,
      depositType: 'buy',
    };
    this.list = [];
    const { externalTokens } = config;
    this.externalTokens = externalTokens;
    this.contracts = {};
  }

  componentDidMount() {
    if (window.location.search.indexOf('airdrop=1') > -1) {
      this.setState({
        sashModalStatus: true,
      });
    }
    this.init(this.props.provider);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (this.state.provider !== this.props.provider) {
      this.init(this.props.provider);
    }
  }

  init = async (provider: any) => {
    let mintingCost;
    let currentPrice;
    let totalSupply;
    this.provider = provider;
    if (!provider) {
      return;
    }
    if (this.provider) {
      this.contracts.SASHTOKEN = new Contract(this.externalTokens.SASHTOKEN[0], abiSASHTOKEN, this.provider);
      totalSupply = await this.contracts.SASHTOKEN.totalSupply();
      this.contracts.uniswapRouter = new Contract(this.externalTokens.uniswapRouter[0], abiRouter, this.provider);
      const unit = '1000000000000000000';
      const mountIn = BigNumber.from(unit);
      currentPrice = await this.contracts.uniswapRouter.getAmountsOut(mountIn, [this.externalTokens.SASHTOKEN[0], this.externalTokens.USDT[0]]);
      this.contracts.bank = new Contract(this.externalTokens.bank[0], abiBank, this.provider);
      mintingCost = await this.contracts.bank.getBondExchangeRateUSDtoSASH('100000000000000000000');
    }
    totalSupply = totalSupply ? getDisplayBalance(totalSupply, 1, 25) : '0';
    currentPrice = currentPrice ? getDisplayBalance(currentPrice[1], 2) : '0';
    mintingCost = mintingCost ? getDisplayBalance(mintingCost, 3) : '0';

    this.setState({
      totalSupply,
      currentPrice,
      mintingCost,
      provider,
    });
  };

  deposit = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }

    this.setState({
      disIsModal: true,
      depositType: 'staking',
    });
  };

  deposit1 = async () => {
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }

    handleBalance().then((res: { chainId: number, balance: string, address: string}) => {
      this.setState({
        allBalance: getBalance(BigNumber.from(res.balance)),
      });
      this.currentAddress = res.address;
    }, (error) => {
      console.error(error);
    });
    this.setState({
      visible: true,
      depositType: 'buy',
    });
  };

  public claimAirdrop = async () => {
    const privateAddress = await this.provider.getAddress();
    const arrayList = [];
    const htmlObj = await axios.get('/airdrop_list.csv');
    const text = htmlObj.data;
    const textList = text.split(/[\n]/g);
    const count = textList ? textList.length : 0;

    this.setState({
      currAddress: privateAddress,
    });
    const isCheck = this.checkAddress(privateAddress, textList);
    if (!isCheck) {
      return;
    }
    const result = Content.getCurrentAddressData(privateAddress, textList);
    if (!result) {
      return;
    }

    for (let i = 0; i < count; i++) {
      const childList = textList[i].split(/,/g);
      arrayList.push({
        account: childList[4],
        amount: BigNumber.from(childList[5].trim() || 0),
      });
    }
    this.list = arrayList;
    const tree = new BalanceTree(this.list);
    // const hexRoot = tree.getHexRoot();

    const { index, address, amount } = result;
    const proof0 = tree.getProof(index || 0, address, BigNumber.from(amount || 0));
    this.contracts.claim = new Contract(this.externalTokens.claim[0], abiClaim, this.provider);
    const claim = await this.contracts.claim.claimAirdrop(proof0, index || 0, address, BigNumber.from(amount || 0));
  };

  // OK in the pop-up box
  handleDisOk = () => {
    this.setState({
      disIsModal: false,
    });
  };

  // Cancel of the dialog box is displayed
  handleDisCancel = () => {
    this.setState({
      disIsModal: false,
    });
  };

  // OK in the pop-up box
  // handleOk = () => {
  //   this.setState({
  //     isModalVisible: false,
  //   });
  // };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // handleClose = () => {
  //   // console.log()
  //   this.onCancel();
  // };
  //
  // handleRefresh = () => {
  //   this.forceUpdate();
  // };

  // 弹出框的cancel
  // handleCancel = () => {
  //   this.setState({
  //     isModalVisible: false,
  //   });
  // };

  handleCurrency = (e: any, i: number, type: string) => {
    this.setState({
      currencyType: type,
      balance: 0,
      stepSize: 0,
    });
    const unit = '100000000000000000000000000';
    const mountIn = BigNumber.from(unit);
  };

  handleRangeChange = (value: number) => {
    this.setState({
      stepSize: value,
      balance: value,
    });
  };

  handleSashClose = () => {
    this.setState({
      sashModalStatus: false,
    });
  };

  handleDeposit = () => {
    this.setState({
      depositStatus: true,
    });
    this.init(this.props.provider);
  };

  handleDepositClose = () => {
    this.setState({
      depositStatus: false,
    });
  };

  approve = async () => {
    if (!this.currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description: 'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
      return;
    }

    if (this.provider && this.currentAddress) {
      this.contracts.ERC20 = new Contract(this.currentAddress, abiERC20, this.provider);
      const unit = '100000000000000000000000000';
      const mountIn = BigNumber.from(unit);
      const approve = await this.contracts.ERC20.approve(this.externalTokens.bank[0], mountIn);
      this.setState({
        isApprove: false,
      });
    }
  };

  swap = async () => {
    let amount: any;
    let mintingCost: any;
    if (!this.provider) {
      alert('No wallet connected');
      return;
    }
    const value = this.state.currencyType;
    if (value === 'BNB') {
      this.contracts.bank.getBondExchangeRateUSDtoSASH('100000000000000000000').then((res: any) => {
        console.log(res);
      }, (error: any) => console.error(error));
      this.contracts.bank
        .buySASHBondWithETH(
          this.currentAddress,
          this.state.amount,
          [this.externalTokens.BNB[0],
            this.externalTokens.USDT[0]],
          { value: utils.parseEther(this.state.amount) },
        ).then((res: any) => {
          console.log(res);
        }, (error: any) => console.error(error));
    } else if (value === 'USDT') {
      amount = parseFloat(this.state.amount);
      amount *= 10 ** 5;
      amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(13));
      this.contracts.bank.buySASHBondWithUSD(this.externalTokens.USDT[0], this.currentAddress, amount);
    } else {
      amount = parseFloat(this.state.amount);
      amount *= 10 ** 5;
      amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(13));
      mintingCost = await this.contracts.bank.buySASHBondWithToken(this.currentAddress, amount, BigNumber.from('1'), [this.currentAddress, this.externalTokens.BNB[0], this.externalTokens.USDT[0]]);
    }
  };

  setAmount = (e: any) => {
    if (e.target.value <= 0) {
      this.setState({
        amount: 0,
      });
      return;
    }
    this.setState({
      amount: e.target.value,
    });
    // this.amount = e.currentTarget.value;
  };

  refresh = () => {
    this.setState({
      amount: 0,
    });
  };

  refreshBond = async () => {
    this.setState({
      bondSpinning: true,
    });
    await this.Child.current.getInputData();
    setTimeout(() => {
      this.setState({
        bondSpinning: false,
      });
    }, 800);
  };

  // Check whether the address exists
  checkAddress = (address: string, list: string[]) => {
    let bool = false;
    let amount = BigNumber.from(0);
    const count = list ? list.length : 0;
    for (let i = 0; i < count; i++) {
      const unit = list[i];
      const childList = unit.split(/,/g);
      if (address === childList[4]) {
        this.currentAddress = childList[4];
        amount = BigNumber.from(childList[5].trim() || 0);
        bool = true;
        break;
      }
    }
    if (!bool) {
      this.setState({
        // isModalVisible: true
        sashModalStatus: true,
      });
      return false;
    }
    this.setState({
      disabled: false,
      amount,
    });
    return true;
  };

  render() {
    const {
      totalSupply, currentPrice, mintingCost, disIsModal,
    } = this.state;
    return (
      <div>
        <div className={styles.title}>DBIT</div>
        <div className={styles.img_container}>
          <div className={styles.img_base}>
            <img src={particle} width="320px" height="320px" alt="" />
            <div className={styles.img_1}>
              <img src={cir} width="140px" height="140px" alt="" />
            </div>
            <div className={styles.img_2}>
              <img src={cir} width="5px" height="5px" alt="" />
            </div>
            <div className={styles.img_3}>
              <img src={cir1} width="10px" height="10px" alt="" />
            </div>
          </div>
        </div>
        <div className={styles.buts}>
          <div className={styles.but1} onClick={this.deposit}>
            {/* <div className={styles.but1} onClick={this.deposit1}> */}
            <span>Stake for DBIT Bonds</span>
          </div>
          <div className={styles.but1} onClick={this.deposit1} style={{ marginTop: 20 }}>
            <span>Buy DBIT Bonds</span>
          </div>
          <div onClick={this.claimAirdrop} className={styles.but1} style={{ margin: '20px 0' }}>
            <span>Claim Airdrop</span>
          </div>
          <div className={styles.but2}>
            <span>Bond Index Info</span>
          </div>
          <div className={styles.but3}>
            <span>DBIT current price</span>
            <span className={styles.price} style={{ color: '#AC930B' }}>
              $
              {currentPrice}
            </span>
          </div>
          <div className={styles.but3}>
            <span>DBIT Supply</span>
            <span className={styles.price} style={{ color: '#5998E0' }}>{totalSupply}</span>
          </div>
          <div className={styles.but3}>
            <span>DBIT minting cost</span>
            <span className={styles.price} style={{ color: '#CC93D3' }}>
              $
              {mintingCost}
            </span>
          </div>
        </div>
        {/* <UnderConstructionModal visible={this.state.visible} onCancel={this.onCancel} /> */}
        {/** Exchange Bond page */}
        <MyModal
          visible={this.state.visible}
          title="BUY DBIT BOND"
          spinning={this.state.bondSpinning}
          refresh={this.refreshBond}
          onCancel={this.onCancel}
        >
          <TradingInterface
            depositType={this.state.depositType}
            provider={this.provider}
            depositChange={this.handleDeposit}
            ref={this.Child}
            currencyType={this.state.currencyType}
            changeCurrency={this.handleCurrency}
            type="bank"
            rangeChange={this.handleRangeChange}
            stepSize={this.state.stepSize}
            refresh
          >
            <span className={`${buySashBond.money} ${buySashBond.block}`}>(IN USD $ 16524.12)</span>
            <span className={`${buySashBond.proportion} ${buySashBond.block}`}>
              {this.state.stepSize}
              %
            </span>
            <Input
              size="small"
              suffix={this.state.currencyType}
              value={this.state.stepSize}
              onChange={(e) => { this.setState({ stepSize: Number(e.target.value) }); }}
            />
          </TradingInterface>
        </MyModal>

        <Deposit
          value={this.state.amount}
          defaultValue={this.state.balance}
          refresh={this.refresh}
          close={this.handleDepositClose}
          type={this.state.currencyType}
          approve={this.approve}
          isApprove={this.state.isApprove}
          swap={this.swap}
          visible={this.state.depositStatus}
          setAmount={this.setAmount}
        />
        {/* Pick up airdrop page */}
        <ClaimAirdrop provider={this.props.provider} title="DBIT" status={this.state.sashModalStatus} close={this.handleSashClose} currAddress={this.state.currAddress} />
        {/* <Modal title="Basic Modal" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}> */}
        {/*  <p>You are not qualified for airdrop！</p> */}
        {/*  <p>You can view the airdrop list！<a href="http://localhost:3000/airdrop_list.csv">http://localhost:3000/airdrop_list.csv</a></p> */}
        {/* </Modal> */}
        <div>
          <Module
            disView={disIsModal}
            provider={this.provider}
            closeView={this.handleDisCancel}
            openView={this.handleDisOk}
            contracts={this.contracts}
          />
        </div>

      </div>
    );
  }
}
