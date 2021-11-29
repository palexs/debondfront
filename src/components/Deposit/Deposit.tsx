import React, {Component} from 'react';
import {Input, AutoComplete ,Modal,Button} from 'antd';
import {Refresh,Close} from "../Icon/Icon";
import "../Modal/css/modal.css"
import "./deposit.css"
type Props = {
  visible:boolean,
  setAmount:any,
  approve:any,
  swap:any,
  type:any,
  isApprove:boolean,
  close:any,
  defaultValue:any,
  refresh:any,
  value:any
}
class Deposit extends Component<Props> {
  render() {
    return (
      <Modal title={<>Deposit for DBIT<Refresh style={{cursor: 'pointer'}} refresh={this.props.refresh} /> <Close
        close={this.props.close} style={{cursor: 'pointer', position: 'absolute', right: "-30px"}}/></>} className="my-modal deposit_wrap" visible={this.props.visible} onCancel={this.props.close}
               footer={null}>
        {/*<div className={styles.search}>
          token: <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{width: 300, marginBottom: "10px"}}
          options={options}
          onChange={this.makeAddress}
        >
          <Input.Search size="large" placeholder="select token" enterButton={null}/>
        </AutoComplete>
        </div>*/}
        <div style={{marginLeft: " 12%"}}>
          amount: <Input type="number" value={this.props.value} defaultValue={this.props.defaultValue} placeholder="Number of inputs"
                         style={{width: "300px", marginBottom: "10px", height: "35px"}}
                         onChange={this.props.setAmount}/>
        </div>
        <div className="deposit_bottom">
          {this.props.isApprove ? <Button   onClick={this.props.approve}>Approve {this.props.type}</Button> : null}
          <Button  onClick={this.props.swap} style={{marginLeft:10}}>SwapAny</Button>
        </div>


      </Modal>
    );
  }
}

export default Deposit;
