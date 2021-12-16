import React, { Component } from 'react';
import {
  Row, Col, List, Button, notification,
} from 'antd';
import axios from 'axios';
import { BigNumber, Contract } from 'ethers';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import Web3 from 'web3';
import MyModal from '../Modal/Index';
import styles from '../../views/bank/css/sash.module.css';
import '../../views/bank/css/sash.css';
import config from '../../config-test';
import { ConfigType, getConfigForNet } from '../../config';
import BalanceTree from '../../views/bank/tree/balance-tree';

type Props = {
  close: () => void,
  status: boolean,
  title: string,
  currAddress: string,
  provider: any,
  web3: Web3 | null,
}

type Item = { index: string, address: string, amount: string };

type State = {
  dataSource: Array<Item>,
  balanceData: Array<{type: string, num: any, unit: string}>,
  spinning: boolean,
};

const abiClaim = require('../../eigma-cash/deployments/claim.json');
const abiBankTest = require('../../eigma-cash/deployments/bankTest.json');

class ClaimAirdrop extends Component<Props, State> {
  static getTruncatedAddress(address: string, amount: number) {
    const leftPart = address.substr(0, amount);
    const rightPart = address.substr(address.length - amount, amount);
    return `${leftPart}...${rightPart}`;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      dataSource: [],
      balanceData: [],
      spinning: false,
    };
  }

  componentDidMount() {
    this.init();
    this.getAirdropList();
  }

  // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
  //   this.init();
  // }

  init = async () => {
    const test = new Contract(config.externalTokens.BANKTEST[0], abiBankTest, this.props.provider);
    const balance = await test.getBalances();
    const balanceData = ['DBIT BALANCE,DIBT Ⓘ', 'DBGT BALANCE,DBGT Ⓘ', 'LOCKED DIBT,DIBT Ⓘ', 'LOCKED DBGT,DBGT Ⓘ'].map((item: string, index: number) => ({
      type: item.split(',')[0],
      num: balance[index],
      unit: item.split(',')[1],
    }));
    this.setState({
      balanceData,
    });
  };

  renderAddressStatus = () => {
    const curr = this.state.dataSource.filter(({ address }) => address === this.props.currAddress);
    if (curr.length > 0) {
      return this.renderAddressInfo(curr[0], true);
    }
    return (<p style={{ textAlign: 'center' }}>It is found that you are not in the airdrop list. You can click the CSV button to download the file or view the online list</p>);
  };

  getAirdropList = async (): Promise<void> => {
    const htmlObj = await axios.get('/airdrop_list.csv');
    const text = htmlObj.data;
    const textList = text.split(/[\n]/g);
    const dataSource = textList.map((item: any) => {
      const childList = item.split(/,/g);
      return {
        index: childList[0],
        address: childList[4],
        amount: childList[5].trim(),
      };
    });
    this.setState({
      dataSource,
    });
  };

  createBalanceTree = (): BalanceTree => {
    const result = this.state.dataSource.map((item: Item) => ({
      account: item.address,
      amount: BigNumber.from(item.amount.trim() || 0),
    }));
    return new BalanceTree(result);
  };

  getConfig = async (): Promise<ConfigType | null> => {
    const netId: string | undefined = await this.props.web3?.eth.net.getNetworkType();
    console.log('NETWORK_ID: ', netId);
    if (netId === 'main' || netId === 'ropsten') {
      return getConfigForNet(netId);
    }
    console.error('Unsupported Ethereum network! Please, make sure you are on Main or Ropsten net.');
    return null;
  };

  refresh = async () => {
    this.setState({
      spinning: true,
    });
    const startTime = Date.now();
    await this.init();
    if (Date.now() - startTime < 100) {
      setTimeout(() => {
        this.setState({
          spinning: false,
        });
      }, 300);
    }
    this.setState({
      spinning: false,
    });
  };

  onClaim = async () => {
    const curr = this.state.dataSource.filter(({ address }) => address === this.props.currAddress);
    if (curr.length === 0) {
      notification.open({
        message: 'Address not found',
        description: 'Your address is not found in the airdrop list.',
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
      return;
    }

    const tree = this.createBalanceTree();
    const { index, address, amount } = curr[0];
    const idx = Number(index) - 1;
    // const root = tree.getHexRoot();
    const proof0 = tree.getProof(idx, address, BigNumber.from(amount || 0));
    // const node = BalanceTree.toNode(idx, address, BigNumber.from(amount));
    const newConfig = await this.getConfig();
    const claimContract = new Contract(newConfig?.claim[0], abiClaim, this.props.provider);

    try {
      const hasClaimed = await claimContract.isClaimed(idx);
      if (hasClaimed === true) {
        notification.open({
          message: 'Airdrop tokens have already been claimed.',
          description: 'This address has already participated in the airdrop. Please, check your wallet.',
          icon: <WarningOutlined style={{ color: '#faad14' }} />,
        });
        return;
      }
    } catch (e) {
      notification.open({
        message: 'Transaction has failed',
        description: e.message,
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
    }
    try {
      const claim = await claimContract.claim(idx || 0, address, BigNumber.from(amount || 0), proof0, { gasLimit: '125000' });
      if (claim) {
        notification.open({
          message: 'Transaction has succeeded',
          description: 'You\'ve successfully claimed your airdrop.',
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        });
      }
    } catch (e) {
      notification.open({
        message: 'Transaction has failed',
        description: e.message,
        icon: <WarningOutlined style={{ color: '#faad14' }} />,
      });
    }
  };

  renderBalance = () => this.state.balanceData.map(({ num, type, unit }, i) => (
    <Col className={styles.item} span={12} key={i}>
      <h3 className={styles.item_title}>{type}</h3>
      <p className={styles.amount}>
        {num}
        {' '}
        {unit}
      </p>
    </Col>
  ));

  renderAddressInfo = (data: Item, isCurrentAddress = false) => (
    <Row className={styles.climAirdrop}>
      <Col span={5}>
        {Object.keys(data)[0]}
        {' '}
        {data.index}
      </Col>
      <Col span={14}>
        {Object.keys(data)[1]}
        {' '}
        <span className={styles.address}>{ClaimAirdrop.getTruncatedAddress(data.address, isCurrentAddress ? 10 : 12)}</span>
      </Col>
      <Col span={5} style={{ textAlign: 'right' }}>
        {Object.keys(data)[2]}
        {' '}
        <span className={styles.amount2}>{data.amount}</span>
      </Col>
    </Row>
  );

  render() {
    return (
      <MyModal
        visible={this.props.status}
        title={this.props.title}
        spinning={this.state.spinning}
        refresh={this.refresh}
        onCancel={this.props.close}
      >
        <div className={styles.wrap}>
          <h1 className={styles.title}>BALANCE</h1>
          <Row>
            {this.renderBalance()}
          </Row>
          {this.renderAddressStatus()}
          <Button className={styles.claim} onClick={this.onClaim}>CLAIM</Button>
          <h1 className={styles.title} style={{ marginTop: 30 }}>AIRDROP LIST Ⓘ</h1>
          <Row>
            <Col
              xs={{
                span: 8,
                push: 16,
              }}
              lg={{
                span: 4,
                push: 18,
              }}
              style={{ margin: '10px 0' }}
            >
              <Button
                title="Download airdrop.csv"
                onClick={() => {
                  window.location.href = `${window.location.origin}/airdrop_list.csv`;
                }}
                style={{ width: '100%' }}
                ghost
                type="default"
                size="large"
              >
                CSV
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              lg={{
                span: 20,
                push: 2,
              }}
              xs={24}
            >
              <List
                className="airDrop"
                size="small"
                header={null}
                footer={null}
                dataSource={this.state.dataSource}
                pagination={{
                  defaultPageSize: 10,
                  total: this.state.dataSource.length,
                  showSizeChanger: false,
                }}
                style={{ width: '100%' }}
                renderItem={(item: Item) => <List.Item className="item">{this.renderAddressInfo(item)}</List.Item>}
              />
            </Col>
          </Row>
        </div>
      </MyModal>
    );
  }
}

export default ClaimAirdrop;
