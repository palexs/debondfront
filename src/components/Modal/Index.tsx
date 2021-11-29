import React, {Component} from 'react';
import {Modal} from "antd";
import PropTypes from "prop-types";
import "./css/modal.css"
import {Close, Refresh} from "../Icon/Icon";

type IMyComponentProps = {
  visible:boolean,
  title:any,
  children:any,
  onCancel:any,
  refresh?:any
  spinning?: boolean,
}
class MyModal extends Component<IMyComponentProps> {
  public render() {
    const {visible,title,children,onCancel,refresh} = this.props;
    return (
      <Modal className={'my-modal'}
             maskClosable={false}
             title={<>{title}<Refresh style={{cursor: 'pointer'}} spinning={this.props.spinning} refresh={refresh}/> <Close className="close_icon" onClick={this.props.onCancel} /></> } visible={visible} onCancel={onCancel}  okButtonProps={{ disabled: true }}>
        {children}
      </Modal>
    );
  }
}

export default MyModal;
