import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Button, Checkbox, Col, Collapse, Input, Modal, ModalProps, Row, Slider, Table, Tabs,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Contract } from 'ethers';
import { inspect } from 'util';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import config from '../../config-test';
import abiTest from '../../eigma-cash/deployments/bankTest.json';
import './css/selectModal.css';
import styles from './css/selectmodal.module.css';
import { Close } from '../Icon/Icon';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import IconFont from '../IconFont/IconFont';
import DexData from './mock/dex.js';
import dex from './mock/dex.js';

const address = config.externalTokens.BANKTEST[0];

const TAKE_OVER_BUTTON = (value: string) => {
  switch (value.toLowerCase()) {
    case 'dex':
      value = 'Take Order';
      break;
    case 'wallet':
      value = 'Redeem';
      break;
    case 'order':
      value = 'Create';
      break;
  }
  return value;
};

const column = [
  {
    title: 'Nonce',
    dataIndex: 'nonce',
    width: 100,
  },
  {
    title: 'ETA',
    dataIndex: 'eta',
    width: 100,
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    width: 200,
  },
  {
    title: 'IN DBIT',
    dataIndex: 'inSASH',
    width: 100,
  },
  {
    title: 'IN USD',
    dataIndex: 'inUSD',
    width: 100,
  },
];

interface Props extends ModalProps {
  provider:any
  type:string
  titleSub:string
  onNewOrder?: any,
  onCreate?: any,
  showBonds?:any,
}

class SelectModal extends Component<Props> {
  content = {
    current: null,
  };

  state = {
    inputValue: 0,
    currKey: '1',
    tableTit: [],
    content: null,
    erc20LoanTit: [],
    erc20LoanData: [],
    nftData: [],
    nftTit: [],
    DexData,
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
    this.getData();
  }

  public getData = async () => {
    const Bank = new Contract(address, abiTest, this.props.provider);
    const result = await Bank.getBondsDexColumns();
    const content = await Bank.getBondsDexData();
    const erc20LoanContent = await Bank.getBondsDexErc20LoanData();
    const erc20LoanTit = await Bank.getBondsDexErc20LoanColumns();
    const nftTit = await Bank.getBondsDexNFTColumns();
    const nftData = await Bank.getBondsDexNFTData();
    this.setState({
      tableTit: result,
      content: JSON.parse(content),
      erc20LoanData: JSON.parse(erc20LoanContent),
      erc20LoanTit,
      nftData: JSON.parse(nftData),
      nftTit,
    });
  };

  public OtherSymbols = (data: any) => data.map((it:string, i: number) => (<Col key={i} span={it == 'PROGRESS' && 8 || 4}><h3 style={{ color: '#fff' }}>{it}</h3></Col>));

  public OrderSymbols = (data: any) => {
    const newData = [
      {
        text: 'SYMBOL',
        span: 2,
      },
      {
        text: 'ETA',
        span: 3,
      },
      {
        text: 'PROGRESS',
        span: 7,
      },
      {
        text: 'AMOUNT',
        span: 2,
      },
      {
        text: 'IN USD',
        span: 2,
      },
      {
        text: 'PERCENTAGE',
        span: 3,
      },
      {
        text: 'BALANCES',
        span: 3,
      },
      {
        text: 'PACKED',
        span: 2,
      },
    ];
    return newData.map((it:any, i: number) => (
      <Col key={i} span={it.span}>
        <h3 style={{ color: '#fff' }}>{ it.text }</h3>
      </Col>
    ));
  };

  public handleSymbol = (data: any) => {
    if (this.props.type === 'order') {
      return this.OrderSymbols(data);
    }
    return this.OtherSymbols(data);
  };

  private handlePercentChange = (range: number) => {
  };

  public handleTakeOrder = (event:any, record:any) => {
    event.stopPropagation();
  };

  public setItemValue = (val: number, index: number, parentIndex: number) => {
    const data = [...this.state.DexData];
    data[parentIndex].list[index].balances = val.toString();
    this.setState({
      DexData: data,
    });
  };

  public onItemBoxChange = (vals: any[]) => {
    // const dex = Object.assign({}, this.state.DEXDATA);
    // dex.list.forEach((item, index) => {
    //   item.is_checked = vals.some(i => i === index);
    //   console.log(item.is_checked)
    // })
    // this.setState({
    //   DEXDATA: dex
    // })
  };

  public onCreateBond = (e:any, data: any) => {
    this.props.onCreate(e, data);
    e.preventDefault();
    e.stopPropagation();
  };

  public onListCheckChange = (index: number, key: number) => {
    const dexData = [...this.state.DexData];
    const item = dexData[key];
    item.list[index].is_checked = !item.list[index].is_checked;
    this.setState({
      DexData: dexData,
    });
  };

  public onSelectChange = (val: any) => {
    const dexData = [...this.state.DexData];
    const item = dexData[val];
    item.is_checked = !item.is_checked;
    item.list.forEach((t) => {
      t.is_checked = item.is_checked;
    });
    this.setState({
      DexData: dexData,
    });
  };

  public onSliderChange = (val: number, key: number) => {
    const DexData = [...this.state.DexData];
    DexData[key].balances = val.toString();
    DexData[key].list.forEach((item) => {
      item.balances = val.toString();
    });
    this.setState({
      DexData,
    });
  };

  public onInputChange = (e: any, key: number) => {
    const DexData = [...this.state.DexData];
    let { value } = e.target;
    if (Number(value) > 100) {
      value = `${100}`;
    } else if (Number(value) < 0) {
      value = `${0}`;
    }
    DexData[key].balances = value;
    DexData[key].list.forEach((item) => {
      item.balances = DexData[key].balances;
    });
    this.setState({
      DexData,
    });
  };

  /**
   *  Transmit the information in to analyze the generated module
   *  @returns {node} element
   *  @param {number} key
   *  @param data
   * */
  public generateTemp = (key:number, data:any) => {
    const { currKey } = this.state;

    if (data) {
      if (currKey == '1') {
        return (
          <Collapse.Panel
            header={(
              <>
                <Row className={styles.panelRow}>
                  <Col span={2}><span style={{ color: '#fff' }}>{data.symbol}</span></Col>
                  <Col span={3}><span style={{ color: '#fff' }}>{data.eta}</span></Col>
                  <Col span={7}>
                    <span style={{ color: '#fff' }}>
                      { make_bar(Number(data.progress), bar_styles[8], 15, 15).str }
                    </span>
                  </Col>
                  <Col span={2}><span style={{ color: '#fff' }}>{ data.amount }</span></Col>
                  <Col span={2}><span style={{ color: '#fff' }}>{ data.inUSD }</span></Col>
                  <Col span={3}>
                    <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                      <Slider
                        value={(parseInt(data.balances))}
                        className={styles.percentSlider}
                        tipFormatter={null}
                        onChange={(val: number) => this.onSliderChange(val, key)}
                      />
                    </div>
                  </Col>
                  <Col span={3}>
                    <p className={styles.label}>
                      {/* <span>{ data.balances }</span> */}
                      <Input value={data.balances} className={styles.labelInput} onChange={(e) => this.onInputChange(e, key)} />
                      /
                      <span className={styles.labelGrow}>100</span>
                    </p>
                  </Col>
                  <Col span={2}>
                    <span style={{ color: '#fff' }}>
                      <div className={styles.inlineblock} onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}>
                        <Checkbox
                          value={key}
                          className={styles.checkbox}
                          onChange={() => this.onSelectChange(key)}
                          checked={data.is_checked}
                        />
                      </div>
                    </span>
                  </Col>
                </Row>
                <Button onClick={(e) => { this.onCreateBond(e, data); }} type="default" className="take_order" ghost>
                  { TAKE_OVER_BUTTON(this.props.type) }
                </Button>
              </>
          )}
            key={key}
            data-key="1"
          >
            <div style={{ width: '100%' }}>
              {
                    data.list.map((item: any, index: number) => (
                      <Row key={item.id}>
                        <Col span={2}><span style={{ color: '#fff' }}>{item.symbol}</span></Col>
                        <Col span={3}><span style={{ color: '#fff' }}>{item.eta}</span></Col>
                        <Col span={7}>
                          <span style={{ color: '#fff' }}>
                            { make_bar(Number(item.progress), bar_styles[8], 15, 15).str}
                          </span>
                        </Col>
                        <Col span={2}><span style={{ color: '#fff' }}>{ item.amount }</span></Col>
                        <Col span={2}><span style={{ color: '#fff' }}>{ item.inUSD }</span></Col>
                        <Col span={3}>
                          <Slider
                            value={(parseInt(item.balances))}
                            className={styles.percentSlider}
                            tipFormatter={null}
                            onChange={(val: number) => this.setItemValue(val, index, key)}
                          />
                        </Col>
                        <Col span={3}>
                          <p className={styles.label}>
                            <span>{ item.balances }</span>
                            /
                            <span>100</span>
                          </p>
                        </Col>
                        <Col span={2}>
                          {/* <span style={{color: "#fff"}}>{ item.PACKED }</span> */}
                          <div className={styles.inlineblock} onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}>
                            <Checkbox
                              value={index}
                              className={styles.checkbox}
                              onChange={() => this.onListCheckChange(index, key)}
                              checked={item.is_checked}
                            />
                          </div>
                        </Col>
                      </Row>
                    ))
                  }
            </div>
          </Collapse.Panel>
        );
      }
      if (currKey == '2') {
        const list = data.list.map((it:any, i:number) => (
          <Col className="item" key={i} span={12}>
            <h4 className="">{it.name}</h4>
            <p>{it.num}</p>
          </Col>
        ));
        return (
          <Collapse.Panel
            header={(
              <>
                <Row>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.symbol}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.balance}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Loan}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.IR}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.DueDate}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.EndedIn}</h3></Col>
                </Row>
                <Button onClick={(e) => { this.handleTakeOrder(e, data); }} type="default" className="take_order" ghost>{this.props.type == 'dex' && 'Take Order' || 'Redeem'}</Button>
              </>
          )}
            key={key}
            data-key="1"
          >
            <Row key={Math.random()} className="erc20Loan">
              {list}
            </Row>
          </Collapse.Panel>
        );
      }
      if (currKey == '3') {
        const list = data.list.map((it:any, i:number) => (
          <Col className="item" key={Math.random()} span={it.span}>
            <h4 className="">{it.name}</h4>
            <p>{it.num}</p>
          </Col>
        ));
        return (
          <Collapse.Panel
            header={(
              <>
                <Row>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.symbol}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Author}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.Loan}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.IR}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.DueDate}</h3></Col>
                  <Col span={4}><h3 style={{ color: '#fff' }}>{data.EndedIn}</h3></Col>
                </Row>
                {
                this.props.type == 'dex'
                && <Button onClick={(e) => { this.handleTakeOrder(e, data); }} type="default" className="take_order" ghost>Take Order</Button>
                || null
              }
              </>
          )}
            key={key}
            data-key="1"
          >
            <Row key={Math.random()} className="nft">
              <Col span={12} className="author">
                <div className="content">
                  <p className="title">
                    {' '}
                    CryptoPunk 42E32b
                    <IconFont style={{ position: 'absolute', right: 0 }} type="icon-lianjie" />
                  </p>
                </div>
              </Col>
              <Row className="rightData">
                {list}
                <Col key={Math.random()} className="item last" span={12}>
                  <h4>SHAREⒾ</h4>
                  <div>
                    <p className="num">
                      <span>{this.state.inputValue}</span>
                      /
                      <span>100</span>
                    </p>
                    <Slider
                      key={Math.random()}
                      tooltipVisible={false}
                      onChange={this.handleSlider}
                      value={this.state.inputValue}
                    />
                  </div>
                </Col>
              </Row>
            </Row>
          </Collapse.Panel>
        );
      }
    }
  };

  /**
   * Listen for TAB bar switching
   * */
  public handleTabsChange = (key: any) => {
    this.setState({
      currKey: key,
    });
  };

  /**
   * Handle slider changes event
   * */
  public handleSlider = (val: any) => {
    this.setState({
      inputValue: val,
    });
  };

  /**
   * Listen for button events
   * @param e
   */
  public onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      alert('Search Something!!!');
    }
  };

  render() {
    const {
      content, erc20LoanData, tableTit, erc20LoanTit, nftData, nftTit,
    } = this.state;

    // @ts-ignore
    return (
      <Modal className={`my-modal selectModal ${styles.selectModal_wrap}`} visible={this.props.visible} title={null} footer={null} width="50%">

        <h1 style={{ textAlign: 'center', color: '#fff' }}>
          {this.props.title}
          {' '}
          <Close
            onClick={this.props.onCancel}
            className={`close_icon ${styles.close_icon}`}
          />
        </h1>
        <Tabs defaultActiveKey={this.state.currKey} centered onChange={this.handleTabsChange}>
          <Tabs.TabPane key={1} tab="ERC-20">
            <h2 className="title" style={{ color: '#fff' }}>{this.props.titleSub}</h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(tableTit)}
            </Row>
            <div className="content_wrap">
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key={101} className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    { this.state.DexData.map((item: any, index:number) => this.generateTemp(index, item)) }
                  </Collapse>
                </Scrollbars>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key={2} tab="ERC-20Loan">
            <h2 className="title" style={{ color: '#fff' }}>{this.props.titleSub}</h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(erc20LoanTit)}
            </Row>
            <div className="content_wrap">
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key={201} className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    {this.generateTemp(1, erc20LoanData[0])}
                    {this.generateTemp(2, erc20LoanData[1])}
                    {this.generateTemp(3, erc20LoanData[2])}
                    {this.generateTemp(4, erc20LoanData[3])}
                    {this.generateTemp(5, erc20LoanData[4])}
                  </Collapse>
                </Scrollbars>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key={3} tab="NFT">
            <h2 className="title" style={{ color: '#fff' }}>{this.props.titleSub}</h2>
            <Row className="list_head" style={{ textAlign: 'center' }}>
              {this.handleSymbol(nftTit)}
            </Row>
            <div className="content_wrap">
              <div className="content" ref={this.content}>
                <Scrollbars>
                  <Collapse key={301} className="collapse_wrap" expandIconPosition="right" ghost defaultActiveKey={['1']} accordion>
                    {this.generateTemp(1, nftData[0])}
                    {this.generateTemp(2, nftData[1])}
                    {this.generateTemp(3, nftData[2])}
                    {this.generateTemp(4, nftData[3])}
                    {this.generateTemp(5, nftData[4])}
                  </Collapse>
                </Scrollbars>
              </div>

            </div>
          </Tabs.TabPane>
        </Tabs>
        {/* 页尾 */}
        <Row className="control">
          <Col span={5}>
            <Input className={styles.format_height} style={{ width: 150, color: '#fff' }} size="large" placeholder="Search..." onKeyUp={this.onKeyUp} />
          </Col>
          <Col span={5}>
            <Button className={styles.format_height} size="large" type="default" ghost>Show All...</Button>
          </Col>
          <Col span={5} />
          <Col span={9}>
            <Button type="default" className={styles.format_height} style={{ color: '#fff' }} onClick={this.props.showBonds}> Bond DEX </Button>
            {/* <Button size="large" type="primary">Balance 234,234,234,234 dbit</Button> */}
          </Col>
        </Row>
        {
            this.props.type !== 'order' && (
            <Row className="createOrder">
              <Col span={24}>
                <Button size="large" ghost icon={<PlusOutlined />} onClick={this.props.onNewOrder}>Create New Order</Button>
                <span style={{ fontSize: 30 }}>Ⓘ</span>
              </Col>
            </Row>
            )
        }
      </Modal>
    );
  }
}

export default SelectModal;
