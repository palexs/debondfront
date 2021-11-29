import React, { Component } from 'react';
import {
  Row, Col, List, Button,
} from 'antd';
import axios from 'axios';
import { start } from 'repl';
import { Contract } from 'ethers';
import MyModal from '../Modal/Index';
import { Close, Refresh } from '../Icon/Icon';
import styles from '../../views/bank/css/sash.module.css';
import '../../views/bank/css/sash.css';
import config from '../../config-test';

type Props = {
  close: any,
  status: boolean,
  title:string,
  currAddress:string,
  provider?:any
}
class ClaimAirdrop extends Component<Props> {
  private provider = this.props.provider;

  private contract:any = {};

  private externalTokens = config.externalTokens;

  state = {
    dataSource: [],
    balanceData: [],
    spinning: false,
  };

  public init = async () => {
    // if (!this.provider.getAddress()){
    //   return;
    // }
    // console.log("provider",this.provider)
    const abi = require('../../eigma-cash/deployments/bankTest.json');
    const test = new Contract(this.externalTokens.BANKTEST[0], abi, this.props.provider);
    // console.log("bankTest",test)
    const balance = await test.getBalances();
    const balanceData = [];
    const name = ['DBIT BALANCE,DIBT Ⓘ', 'DBGT BALANCE,DBGT Ⓘ', 'LOCKED DIBT,DIBT Ⓘ', 'LOCKED DBGT,DBGT Ⓘ'];
    for (let i = 0; i < name.length; i++) {
      balanceData.push({
        type: name[i].split(',')[0],
        num: balance[i],
        unit: name[i].split(',')[1],
      });
    }
    this.setState({
      balanceData,
    });
  };

  public handleRefresh = () => {};

  public Balance = () => this.state.balanceData.map(({ num, type, unit }, i) => (
    <Col className={styles.item} span={12} key={i}>
      <h3 className={styles.item_title}>{type}</h3>
      <p className={styles.amount}>
        {num}
        {' '}
        {unit}
      </p>
    </Col>
  ));

  public WalletInfo = (data:any, type:any = false) => (
    <Row className={styles.climAirdrop}>
      <Col span={type && 5 || 5}>
        {Object.keys(data)[0]}
        {' '}
        {data.index}
      </Col>
      <Col span={type && 10 || 14}>
        {Object.keys(data)[1]}
        {' '}
        <span className={styles.address}>{data.address}</span>
      </Col>
      <Col span={type && 9 || 5} style={{ textAlign: 'right' }}>
        {Object.keys(data)[2]}
        {' '}
        <span className={styles.amount2}>{data.amount}</span>
      </Col>
    </Row>
  );

  componentDidMount() {
    this.getAirdropList();
  }

  componentWillReceiveProps(nextProps: any, nextContext: any) {
    this.init();
  }

  public handleLuckyOnes = () => {
    const curr = this.state.dataSource.filter(({ address }, i) => address == this.props.currAddress);
    if (curr.length) {
      return this.WalletInfo(curr[0], true);
    }
    return (<p style={{ textAlign: 'center' }}>It is found that you are not in the airdrop list. You can click the CSV button to download the file or view the online list</p>);
  };

  public getAirdropList = async () => {
    const html = await axios.get(`http://${window.location.host}/airdrop_list.csv`);
    const text = html.data;
    const textList = text.split(/[\n]/g);
    const count = textList ? textList.length : 0;
    const dataSource = [];
    for (let i = 0; i < count - 1; i++) {
      const unit = textList[i];
      const childList = unit.split(/,/g);
      const objectNew = {} as any;
      objectNew.index = childList[0];
      objectNew.address = childList[4];
      objectNew.amount = String(childList[5]).replace(/\r/g, '');
      dataSource.push(objectNew);
    }
    this.setState({
      dataSource,
    });
  };

  public checkAddress(address: string, list: any) {
    const count = list ? list.length : 0;
    const bool = false;
    const amount = 0;
    for (let i = 0; i < count; i++) {
      const unit = list[i];
      const childList = unit.split(/,/g);
      // if (address == childList[4]) {
      const objectNew = {} as any;
      objectNew.index = childList[0];
      objectNew.address = childList[4];
      objectNew.amount = childList[5];
      //   amount = childList[5] | 0;
      //   // this.currentAddress = objectNew;
      //   bool = true;
      // }
    }
  }

  public refresh = async () => {
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

  public onClaim = async () => {
    const abi = require('../../eigma-cash/deployments/bankTest.json');
    const bank = new Contract(config.externalTokens.TEST[0], abi, this.props.provider);
    // console.log(this.props.provider)
    const res = await bank.handleCliam('0x3aFf7B140E43243356EF4Aa880242083a927EA91');
    // console.log(res)
  };

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
            {this.Balance()}
          </Row>
          {this.handleLuckyOnes()}
          <Button className={styles.claim} onClick={() => { this.onClaim(); }}>CLAIM</Button>
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
                renderItem={(item:any) => <List.Item className="item">{this.WalletInfo(item)}</List.Item>}
              />
            </Col>
          </Row>
        </div>
      </MyModal>
    );
  }
}

export default ClaimAirdrop;
