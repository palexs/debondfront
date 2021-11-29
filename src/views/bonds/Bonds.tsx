import { ethers } from 'ethers';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Web3 from 'web3';
import { Content } from './component/Content';
import styles from './css/bonds.module.css';
import { HeaderNav } from '../../components/header/HeaderNav';

type IMyComponentState = {
    value: string;
    isModalVisible: boolean;
    disabled: boolean;
    amount: number;
}
type Props = {
    provider:any
}
export class Bonds extends React.Component<Props, IMyComponentState> {
  public tree: any;

  public list: Array<any>;

  public provider: any;

  public contracts: any;

  public walletWithProvider: any;

  public currentAddress: any;

  public constructor(props?: any) {
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

  public componentDidMount(props?: any, context?: any) {
    this.initData();
  }

  public async initData() {
    // 引入web3
    // 检查是否是新的MetaMask 或 DApp浏览器
    let web3Provider;
    const windowNew = window as any;
    if (windowNew.ethereum) {
      web3Provider = windowNew.ethereum;
      try {
        // 请求用户授权
        await windowNew.ethereum.enable();
      } catch (error) {
        // 用户不授权时
        console.error('User denied account access');
        return;
      }
    } else if (windowNew.web3) {
      // 老版 MetaMask Legacy dapp browsers...
      web3Provider = windowNew.web3.currentProvider;
    } else {
      alert('It is detected that there is no metamask plug-in in the current browser!');
      web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    const web3 = new Web3(web3Provider);
    // 从MetaMask中取出用户
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const walletWithProvider = provider.getSigner();
    this.walletWithProvider = walletWithProvider;
    this.forceUpdate();
  }

  public render() {
    const { isModalVisible, disabled } = this.state;
    // var id = this.props.match.params ? this.props.match.params.id : "0";
    return (
      <div>
        {/* <div className={styles.header}><HeaderNav provider={this.provider}/></div> */}
        <div className={styles.content}>
          {/* {id == "1" ? <ContentOne provider={this.walletWithProvider} /> : <Content provider={this.walletWithProvider} />} */}
          <Content provider={this.walletWithProvider} />
        </div>
      </div>
    );
  }
}
