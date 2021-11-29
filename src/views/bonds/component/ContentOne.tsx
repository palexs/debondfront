import React from "react";
import styles from "../css/bonds.module.css";
import { Button, Collapse, Table } from "antd";
import { NavLink } from "react-router-dom";
import { BigNumber, Contract } from "ethers";
import { getDisplayBalance, roundFun } from "../../../eigma-cash/format_util";
import { Module } from "./Module";
import { ModuleOne } from "./ModuleOne";
import config from "../../../config";
const { Panel } = Collapse;
const columns = [
  {
    title: "N",
    dataIndex: "N",
    width: 15
  },
  {
    title: "ERD",
    dataIndex: "ERD",
    width: 50
  },
  {
    title: "Balances",
    dataIndex: "Balances",
    width: 35
  },
];
export interface IMyComponentState {
  contentVisible: boolean;
  dataSource: any;
  disIsModal: boolean;
  disIsModalOne: boolean;
  index: any;
}
type IMyComponentProps = {
  provider: any
}
export class ContentOne extends React.Component<IMyComponentProps, IMyComponentState> {
  public contracts: any;
  public provider: any;
  public currentAddress: any;
  public externalTokens: any;
  /**
   * constructor
   */
  public constructor(props: any, context?: any) {
    super(props);
    this.state = {
      contentVisible: false,
      disIsModal: false,
      disIsModalOne: false,
      index: 0,
      dataSource: [
        {
          key: "1",
          name: "aaa",
          amount: "200",
          seller: "200",
          price: "200",
          endedin: "200",
          description: [
            { key: "1", N: "234", ERD: "08-08-2021", Balances: "12444" },
            { key: "2", N: "234", ERD: "08-08-2021", Balances: "12444" },
            { key: "3", N: "234", ERD: "08-08-2021", Balances: "12444" },
            { key: "4", N: "234", ERD: "08-08-2021", Balances: "12444" },
          ],
        },
        {
          key: "2",
          name: "aaa",
          amount: "200",
          seller: "200",
          price: "200",
          endedin: "200",
          description: [
            { N: "234", ERD: "08-08-2021", Balances: "12444" },
            { N: "234", ERD: "08-08-2021", Balances: "12444" },
            { N: "234", ERD: "08-08-2021", Balances: "12444" },
            { N: "234", ERD: "08-08-2021", Balances: "12444" },
          ],
        },
      ],
    }
    this.contracts = {};
    const { externalTokens } = config;
    this.externalTokens = externalTokens;
    this.provider = this.props.provider;
  }
  componentDidMount() {
    this.init(this.props.provider);
  }
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (this.provider != nextProps.provider) {
      this.init(nextProps.provider);
    }
  }
  public init = async (provider: any) => {
    if (!provider) {
      return;
    }
    this.provider = provider;
    var abiBond = require("../../../eigma-cash/deployments/bonds.json");
    this.contracts["bonds"] = new Contract(this.externalTokens["bonds"][0], abiBond, this.provider);
    var abi = require("../../../eigma-cash/deployments/dex.json");
    this.contracts["dex"] = new Contract(this.externalTokens["dex"][0], abi, this.provider);
    this.currentAddress = await provider.getAddress();
    var list = await this.contracts["dex"].getAuction(BigNumber.from(0), BigNumber.from(100));
    var count = list ? list.length : 0;
    var data = [];
    for (var i = 0; i < count; i++) {
      var unitOne = list[i];
      if (unitOne["auctionStatut"] == true) {
        var classa = unitOne["bondClass"][0];
        var sym = await this.contracts["bonds"].getBondSymbol(classa);
        var nonce = await this.contracts["bonds"].getNonceCreated(classa);
        var listTwo = [];
        for (var j = 0; j < nonce.length; j++) {
          var unit = {} as any;
          var mount = await this.contracts["bonds"].balanceOf(this.currentAddress, classa, nonce[j]);
          var info = await this.contracts["bonds"].getBondInfo(classa, nonce[j]);
          var time = info[1].toNumber();
          var timestamp = new Date(time * 1000);
          var lotime = timestamp.toLocaleDateString().replace(/\//g, "-");
          mount = getDisplayBalance(mount, 5, 18);
          unit["N"] = nonce[j].toNumber();
          unit["ERD"] = lotime;
          unit["Balances"] = parseFloat(mount);
          listTwo.push(unit);
        }
        var obj = {} as any;
        obj["key"] = sym;
        obj["name"] = sym;
        obj["amount"] = getDisplayBalance(unitOne["bondAmount"][0], 4, 18);
        obj["seller"] = unitOne["seller"] ? unitOne["seller"].substring(0, 8) + "..." : "0x000...";
        obj["price"] = roundFun(unitOne["startingPrice"].toNumber(), 5);
        var time1 = unitOne["auctionTimestamp"].toNumber();
        var time2 = Math.round(new Date().getTime() / 1000);
        var time3 = time2 - time1;
        var time4 = unitOne["auctionDuration"].toNumber();
        if (time3 > time4) {
          continue;
        }
        obj["endedin"] = this.formatSeconds(unitOne["auctionDuration"].toNumber() - time3);
        obj["index"] = i;
        obj["description"] = listTwo;
        data.push(obj);
      }
    }
    this.setState({
      dataSource: data
    })
  }

  formatSeconds(value: any) {
    var secondTime = parseInt(value);
    var minuteTime = 0;
    var hourTime = 0;
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60 + "");

      secondTime = parseInt(secondTime % 60 + "");

      if (minuteTime > 60) {

        hourTime = parseInt(minuteTime / 60 + "");

        minuteTime = parseInt(minuteTime % 60 + "");
      }
    }
    var result = "";

    if (minuteTime > 0) {
      result = "" + parseInt(minuteTime + "") + "M" + result;
    }
    if (hourTime > 0) {
      result = "" + parseInt(hourTime + "") + "H" + result;
    }
    if (!result) {
      result = "" + parseInt(secondTime + "") + "S";
    }
    return result;
  }

  /**
   * onExchangeClick
   */
  public onExchangeClick = () => {
    //
    this.setState({ contentVisible: true })
  }
  /**
 * onExitClick
 */
  public onExitClick = () => {
    //
    this.setState({ contentVisible: false })
  }

  public takeOrder = (index: any, e: any) => {
    this.setState({
      disIsModalOne: true,
      index: index
    })
    return undefined;
  }
  public makePanels() {
    var dataSource = this.state.dataSource;
    var length = dataSource.length;
    var panels = [];
    for (var i = 0; i < length; i++) {
      let index = dataSource[i].index;
      var item = (
        <Panel
          header={
            <div> <div className={styles.panelHeader}>
              <div>{dataSource[i].name}</div>
              <div>{dataSource[i].amount}</div>
              <div>{dataSource[i].seller}</div>
              <div>{dataSource[i].price}</div>
              <div>{dataSource[i].endedin}</div>
            </div>
              {

                (dataSource[i].index || dataSource[i].index == 0) ? (<div> <Button className={styles.rightTake} onClick={e => this.takeOrder(index, e)}>take order</Button></div>) : null

              }
            </div>
          }
          /*     header="sss" */
          key={i + 2}
          className={styles.collapse_panel}
        >
          {this.makeTable(dataSource[i])}

        </Panel>
      );
      panels.push(item);
    }
    var item = (
      <div style={{ position: "absolute", marginTop: "15px", width: "100%" }}>
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
          <Button style={{ background: "black", color: "white" }}>Search...</Button>
          <Button style={{ background: "black", color: "white" }}>Show More...</Button>
          <Button style={{ background: "black", color: "white" }} onClick={this.createOrder}>Create Order</Button>
        </div>
      </div>
    )
    panels.push(item);
    var item = (
      <Panel
        header={
          <div className={styles.panelHeaderOne}>
            <div>{"SYMBOL"} <span style={{ fontWeight: 100 }}>{"⇕"}</span></div>
            <div>{"BALANCES "}<span style={{ fontWeight: 100 }}>{"⇕"}</span></div>
            <div>{"SELLER "}<span style={{ fontWeight: 100 }}>{"⇕"}</span></div>
            <div>{"PRICE "}<span style={{ fontWeight: 100 }}>{"⇕"}</span></div>
            <div>{"ENDED in "}<span style={{ fontWeight: 100 }}>{"⇕"}</span></div>
          </div>
        }
        /*     header="sss" */
        key={1}
        className={styles.collapse_panel}
        showArrow={false}
        collapsible={undefined}
      >
        { }

      </Panel>
    )
    panels.unshift(item);
    var item = (
      <Panel
        header={
          <div className={styles.panelHeaderOneOne}>
            Pending Auctions <span>↺ </span><span style={{ fontWeight: 100 }}> ⇕</span>
          </div>
        }
        /*     header="sss" */
        key={0}
        className={styles.collapse_panelOne}
        showArrow={false}
      >
        { }

      </Panel>
    )
    panels.unshift(item);
    return panels;
  }

  public createOrder = () => {
    if (!this.provider) {
      return;
    }
    this.setState({
      disIsModal: true
    })
  }

  public makeTable(dataSource: any) {
    return (
      <Table
        className={styles.tables}
        bordered={false}
        size="small"
        tableLayout={"fixed"}
        showHeader={true}
        columns={columns}
        pagination={false}
        dataSource={dataSource.description}
      />
    );
  }



  public handleDisOneOk = () => {
    this.setState({
      disIsModalOne: false
    })
  }


  public handleDisOneCancel = () => {
    this.setState({
      disIsModalOne: false
    })
  }


  public handleDisOk = () => {
    this.setState({
      disIsModal: false
    })
  }


  public handleDisCancel = () => {
    this.setState({
      disIsModal: false
    })
  }

  /**
   * makeContent1
   */
  public makeContent1() {
    return (
      <div>
        <div className={styles.but1} style={{ margin: '20px 0', }} onClick={this.onExitClick}>
          <span>Exit</span>
        </div>
      </div>)
  }
  public render() {
    var panels = this.makePanels();
    var { contentVisible, disIsModal, disIsModalOne, index } = this.state;
    return (
      <div>
        <div>
          <span className={styles.bondsText}>BONDS DEX</span>
        </div>
        <Collapse
          bordered={false}
          accordion={true}
          className={styles.collapse}
          expandIconPosition={"right"}
        >
          {panels}
        </Collapse>
        <div>
          <Module disView={disIsModal} provider={this.provider} closeView={this.handleDisCancel} openView={this.handleDisOk} contracts={this.contracts}></Module>
        </div>
        <div>
          <ModuleOne index={index} disView={disIsModalOne} provider={this.provider} closeView={this.handleDisOneCancel} openView={this.handleDisOneOk} contracts={this.contracts}></ModuleOne>
        </div>
      </div>
    )
  }
}