import React from "react";
import styles from "../css/bonds.module.css";
import UnderConstructionModal from "../../../components/UnderConstructionModal/UnderConstructionModal";
import cir from '../../../assets/cir.png'
import cir1 from '../../../assets/circ1.png'
import trian from '../../../assets/trian.png'
import particle from '../../../assets/particle.gif'
import {Button, Select} from "antd";
import { verifyTypedData } from "@ethersproject/wallet";
import { NavLink } from "react-router-dom";
import { BigNumber, Contract } from "ethers";
import { ContentModule } from "./ContentModule";
import SelectModal from "../../../components/SelectModal/SelectModal";
import NewOrderModal from "../../../components/NewOrderModal/SelectModal";
import CreateModal from "./CreateModal";


export interface IMyComponentState {
  contentVisible: boolean
  disIsModal: boolean
  walletStatus:boolean,
  createVisible: boolean,
  newOrderVisible: boolean,
  newOrderData:any
}
type IMyComponentProps = {
  provider: any
}
export class Content extends React.Component<IMyComponentProps, IMyComponentState> {
  public state: IMyComponentState;
  public provider: any;
  public contracts: any;
  public currentAddress: any;
  /**
   * constructor
   */
  public constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      contentVisible: false,
      disIsModal: false,
      walletStatus:false,
      createVisible: false,
      newOrderVisible: false,
      newOrderData:null
    }
    this.provider = this.props.provider;
    this.contracts = {};
  }

  componentDidMount() {
    this.init(this.props.provider);
  }
  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (this.provider != nextProps.provider) {
      this.init(nextProps.provider);
    }
  }

  public init = (provider: any) => {
    if (!provider) {
      return;
    }
    this.provider = provider;
  }

  public onExchangeClick = () => {
    //
    this.setState({ contentVisible: !this.state.contentVisible })
  }
  /**
 * onExitClick
 */
  public onExitClick = () => {
    //
    this.setState({ contentVisible: false })
  }
  public redeemBonds = async () => {
    /*把建设中取消后把这个代码注释打开*/
    // if (!this.provider) {
    //   alert("No wallet connected");
    //   return;
    // }
    this.setState({
      disIsModal: true
    })
  }
  public handleDisOk = () => {
    this.setState({
      disIsModal: false
    })
  }

  public handleWalletStatus = ()=>{
    this.setState({
      walletStatus:!this.state.walletStatus
    })
  }

  public handleDisCancel = () => {
    this.setState({
      disIsModal: false
    })
  }

  public setNewOrderVisible = () => {
    this.state.walletStatus && this.setState({ walletStatus: false })
    this.state.contentVisible && this.setState({ contentVisible: false })
    this.setState({
      newOrderVisible: !this.state.newOrderVisible
    })
  }
  /**
   * makeContent
   */
  public makeContent(): JSX.Element {
    const {disIsModal} = this.state;
    return (
      <div >
        <div className={styles.title}>BONDS</div>
        <div className={styles.img_container}>
          <div className={styles.img_base}>
            <img src={particle} width="320px" height="320px" alt={""}/>
            <div className={styles.img_1}>
              <img src={trian} width="140px" alt={""}/>
            </div>
            <div className={styles.img_3}>
              <img src={cir1} width="10px" height="10px" alt={""}/>
            </div>
          </div>
        </div>
        <div className={styles.buts}>
          {/*<div className={styles.but1} onClick={this.redeemBonds}>*/}
          <div className={styles.but1} onClick={this.handleWalletStatus}>
            <span>Redeem Bonds</span>
          </div>
          {/*<div className={styles.but1} onClick={this.redeemBonds} style={{ margin: '20px 0', color: "white" }}>*/}
          <div className={styles.but1} onClick={this.onExchangeClick} style={{ margin: '20px 0', color: "white" }}>
            {/*<NavLink exact={true} activeClassName={styles.actives} to="/bonds/1"><span style={{ color: "white" }}>Exchange Bonds</span></NavLink>*/}
            <span style={{ color: "white" }}>Exchange Bonds</span>
          </div>
          {/*<div className={styles.but1} style={{ color: "white" }}>*/}
          <div className={styles.but1} style={{ color: "white" }} onClick={this.redeemBonds}>
            <span>Create Bonds</span>
          </div>
        </div>
        <div>
          {/*建设中*/}
          <UnderConstructionModal visible={disIsModal} onCancel={this.handleDisCancel} provider={this.provider}/>
          {/*<ContentModule disView={disIsModal} provider={this.provider} closeView={this.handleDisCancel} openView={this.handleDisOk} contracts={this.contracts}/>*/}
          <SelectModal titleSub="Pending Auctions"
                       type="dex"
                       provider={this.provider}
                       title="BONDs DEX"
                       visible={this.state.contentVisible}
                       onCancel={this.onExchangeClick}
                       onNewOrder={this.setNewOrderVisible} />
          <SelectModal titleSub="My BONDs" type="wallet" provider={this.provider} title="BONDs Wallet" visible={this.state.walletStatus} onCancel={this.handleWalletStatus} onNewOrder={this.setNewOrderVisible}/>
          <NewOrderModal titleSub="Create New Order"
                         type="order"
                         provider={this.provider}
                         title="BONDS DEX"
                         visible={this.state.newOrderVisible}
                         onCancel={this.setNewOrderVisible}
                         showBonds={() => { this.setState({newOrderVisible: false, contentVisible: !this.state.contentVisible}) }}
                         onCreate={(e:any,data:any) => {
            this.setState({
              createVisible: true,
              newOrderData:data
            })
          }} />
          <CreateModal selectData={this.state.newOrderData} provider={this.provider} visible={this.state.createVisible} onCancle={() => {
            this.setState({createVisible: !this.state.createVisible})
          }}/>
        </div>
      </div>
    )
  }

  public render() {
    const content = this.makeContent();
    // var { contentVisible } = this.state;
    return (
      content
    )
  }
}
