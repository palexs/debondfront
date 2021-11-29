import React, {Component} from 'react';
import {Close, Refresh} from "../../../components/Icon/Icon";
import TradingInterface from "../../../components/TradingInterface/TradingInterface";
import buySashBond from "../../bank/css/buySashBond.module.css";
import MyModal from "../../../components/Modal/Index";
import {Input} from "antd";
type Props = {
  status:boolean,
  close:any
  balances:any,
  title:string,
  provider?:any,
  type?:string
}
class BuySgmBond extends Component<Props> {
  state = {
    visible:false,
    currencyType:"USDT",
    stepSize:0,
  }
  public handleRefresh = ()=>{

  }
  public handleClose=()=>{

  }
  public onCancel =()=>{

  }
  public handleDeposit = ()=>{

  }
  public handleCurrency = ()=>{

  }
  public handleRangeChange = (val: any)=>{
    this.setState({
      stepSize:val
    })
  }
  render() {
    return (
      <MyModal visible={this.props.status}
               title={this.props.title}
               onCancel={this.props.close}>
        <TradingInterface
          provider={this.props.provider}
          depositChange={this.handleDeposit}
          currencyType={this.state.currencyType}
          changeCurrency={this.handleCurrency}
          rangeChange={this.handleRangeChange}
          stepSize={this.state.stepSize}
          refresh={true}
          type="gov"
          depositType={this.props.type}
        >
          {/*<span className={`${buySashBond.money} ${buySashBond.block}`}>(IN USD $ 16524.12)</span>
          <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{this.state.stepSize}%</span>
          <span className={`${buySashBond.currencyNum} ${buySashBond.block}`}>{this.props.balances}<span className={buySashBond.currencyType}>{this.state.currencyType}</span></span>*/}
          <span className={`${buySashBond.money} ${buySashBond.block}`}>(IN USD $ 16524.12)</span>
          <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{this.state.stepSize/100}%</span>
          <Input size="small" suffix={this.state.currencyType} value={this.state.stepSize} onChange={(e) => {
            let val = Number(e.target.value)
            if (isNaN(val)) e.target.value = String(0);
            if (Number(e.target.value)>100) e.target.value = String(100);
            if (Number(e.target.value)<0) e.target.value = String(0);
            this.setState({stepSize: Number(e.target.value)})
          }} />

        </TradingInterface>
      </MyModal>
    );
  }
}

export default BuySgmBond;
