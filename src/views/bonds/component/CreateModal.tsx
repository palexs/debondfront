import React, {Component} from "react";
import MyModal from "../../../components/Modal/Index";
import {Button, Input, Slider, Row, Col, notification} from "antd";
import styles from '../css/bonds.module.css';
import commonStyles from '../../../common/css/util.module.css';

import {PlusOutlined, WarningOutlined} from "@ant-design/icons";
import {BigNumber, Contract} from "ethers";
import config from "../../../config-production";
import buySashBond from "../../bank/css/buySashBond.module.css";
import moment from "moment";
import  "../css/createModal.css"
import {setState} from "jest-circus/build/state";
interface Props {
  visible: boolean,
  onCancle: any,
  provider?: any,
  selectData?:any
}

class CreateModal extends Component<Props> {
  private address: string = config.externalTokens.dexTest[0];
  state = {
    dueDate: 0,
    redate: 0,
    currentDateFormat:moment(Date.now()).format('YYYY-MM-DD'),
    dueInput:0,
    mostRepayment:0,
    leastRepayment:0,
    max:0,
    min:0,
    duration:0,
    currentDurationFormat:moment(Date.now()).format('YYYY-MM-DD'),
    saveStatus:true,
    isApprove:false
  }

    public onDueDateChange = (val: any) => {

      // const days = Math.floor(val * (0.30));
      const newDate = moment(Date.now()).add(val, 'days')
        this.setState({
            dueDate: val ,
          currentDateFormat:moment(newDate).format('YYYY-MM-DD')
        })
    }
    public onDurationChange = (val: any) => {

      // const days = Math.floor(val * (0.30));
      const newDate = moment(Date.now()).add(val, 'days')
        this.setState({
            duration: val ,
          currentDurationFormat:moment(newDate).format('YYYY-MM-DD')
        })
    }

    public onRedateChange =  (val: any) => {
        let {max,min} = this.state;
        max = Number(max);
        min = Number(min);

        this.setState({
            redate: val,
          mostRepayment:max + (max * (val/ 100))  ,
          leastRepayment:min + ((min * (val / 100)) ),
        })
    }

  public sliderRedate() {
    return (
      <div className={styles.dueDateSlider} key={10000000000000323244}>
        <div onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}>
          <div className={styles.sliderTitle}>INTERST REATE <span>Ⓘ</span></div>
          <Slider value={this.state.redate}
                  className={styles.percentSlider}
                  tipFormatter={null}
                  min={0}
                  max={200}
                  onChange={this.onRedateChange} />
          <div className={buySashBond.infos} style={{width:"100%"}}>
            <span className={`${buySashBond.money} ${buySashBond.block}`}>(max: {this.state.mostRepayment}  min: {this.state.leastRepayment})</span>
            <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{this.state.redate  }%</span>

          </div>
        </div>
      </div>
    )
  }

  public sliderDate() {
    return (
      <div className={styles.dueDateSlider} key={10000345345000000000324}>
        <div onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}>
          <div className={styles.sliderTitle}>DUE DATE <span style={{fontSize: 30}}>Ⓘ</span></div>
          <Slider value={this.state.dueDate}
                  className={styles.percentSlider}
                  tipFormatter={null}
                  min={0}
                  max={365}
                  onChange={this.onDueDateChange}/>
          <div className={buySashBond.infos} style={{width:"100%"}}>
            <span className={`${buySashBond.money} ${buySashBond.block}`}>(365 DAYS {this.state.currentDateFormat})</span>
            <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{ Math.floor(this.state.dueDate / 3.65) }%</span>
            <Input size="small" className={"input_erc20"}
                   suffix={"DAYS"}
                   value={this.state.dueDate}
                   onChange={(e) => {
                     let val = Number(e.target.value)
                     if (isNaN(val)) e.target.value = String(0);
                     if (Number(e.target.value)>365) e.target.value = String(365);
                     if (Number(e.target .value)<0) e.target.value = String(0);
                     this.setState({dueDate: Number(e.target.value)})
                   }} />
          </div>
        </div>
      </div>
    )
  }
  public sliderDuration() {
    return (
      <div className={styles.dueDateSlider} key={100003453435435}>
        <div onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}>
          <div className={styles.sliderTitle}>DURATION<span style={{fontSize: 30}}>Ⓘ</span></div>
          <Slider value={this.state.duration}
                  className={styles.percentSlider}
                  tipFormatter={null}
                  min={0}
                  max={30}
                  onChange={this.onDurationChange}/>
          <div className={buySashBond.infos} style={{width:"100%"}}>
            <span className={`${buySashBond.money} ${buySashBond.block}`}>(30 DAYS {this.state.currentDurationFormat})</span>
            <span className={`${buySashBond.proportion} ${buySashBond.block}`}>{ Math.floor(this.state.duration / 0.3 ) }%</span>
            <Input key={120} size="small" className={"input_erc20"}
                   suffix={"DAYS"}
                   value={this.state.duration}
                   onChange={(e) => {
                     let val = Number(e.target.value)
                     if (isNaN(val)) e.target.value = String(0);
                     if (Number(e.target.value)>30) e.target.value = String(30);
                     if (Number(e.target .value)<0) e.target.value = String(0);
                     this.setState({duration: Number(e.target.value)})
                   }} />
          </div>
        </div>
      </div>
    )
  }

  public  saveCreate = async (e: any)  =>{

    const abi = require("../../../eigma-cash/testAbi/LOAN.json");
    const Loan = new Contract(config.testAddress['Loan'][0],abi,this.props.provider);
    await Loan.createLoan(
      0,
      this.props.provider.getAddress(),
      this.state.max,
      this.state.min,
      this.state.duration * 84600,
      this.state.redate,
      this.state.dueDate * 84600,
      this.props.selectData.symbol,
      this.props.selectData.amount
    )
    this.props.onCancle();
  }
  public approve = async () => {
    const currentAddress = await this.props.provider.getAddress();
    if (!currentAddress) {
      notification.open({
        message: 'No wallet connected',
        description: 'Please click the Connect Wallet button first',
        icon: <WarningOutlined style={{color: "#faad14"}}/>,
      });
      return;
    }
    const abi = require("../../../eigma-cash/deployments/TestToken.json");
    if (this.props.provider && currentAddress) {
      const ERC20 = new Contract(currentAddress, abi, this.props.provider);
      const unit = "100000000000000000000000000";
      const mountIn = BigNumber.from(unit);
      const approve = await ERC20.approve(this.address, mountIn);
      this.setState({
        isApprove: true,
        saveStatus:!this.state.saveStatus
      })
    }
  }
  public handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  render() {
    return (
      <MyModal visible={this.props.visible} title={"Create"} onCancel={this.props.onCancle}>
        <div className={styles.createModalContent}>
          <div className={styles.inputWrapper}>
            <div className={styles.inputItem}>
              <h3>MAX</h3>
              <Input className={`${styles.CreateAmountInput} ${commonStyles.default_input}`}
                     style={{width: 150, color: "#fff"}}
                     size="large"
                       placeholder="MAX LOAN AMOUNT" name="max" value={this.state.max} onChange={(e)=>{this.handleChange(e)}} type={'number'}/>
              <span>(IN USD $3621.45)</span>
            </div>
            <div className={styles.inputItem}>
              <h3>MIN</h3>
              <Input className={`${commonStyles.default_input} ${styles.CreateAmountInput}`}
                     style={{width: 150, color: "#fff"}}
                     size="large"
                     placeholder="MIN LOAN AMOUNT" name={"min"} value={this.state.min} onChange={(e)=>{this.handleChange(e)}} type={'number'}/>
              <span>(IN USD $3621.45)</span>
            </div>
          </div>
          {this.sliderDate()}
          {this.sliderRedate()}
          {this.sliderDuration()}
          <Row>
            <Col span={11}>
              <Button className={`${commonStyles.default_button} ${styles.CreateButton}`} size="large" type={"primary"}
                      onClick={this.approve}>Approve</Button>
            </Col>
            <Col span={11} push={2}>
              <Button className={`${commonStyles.default_button} ${styles.CreateButton}`} style={{opacity:this.state.saveStatus && .5||1}} disabled={this.state.saveStatus} size="large" type={"primary"}
                      onClick={this.saveCreate}>Save</Button>
            </Col>
          </Row>

        </div>
      </MyModal>
    );
  }
}

export default CreateModal;
