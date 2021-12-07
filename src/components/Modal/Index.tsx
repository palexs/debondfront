import React from 'react';
import { Modal } from 'antd';
import './css/modal.css';
import { Close, Refresh } from '../Icon/Icon';

type IMyComponentProps = {
  visible: boolean,
  title: string,
  children: any,
  onCancel: any,
  refresh?: any
  spinning?: boolean,
}

const MyModal = function (props: IMyComponentProps) {
  const {
    visible, title, children, onCancel, refresh,
  } = props;
  return (
    <Modal
      className="my-modal"
      maskClosable={false}
      title={(
        <>
          {title}
          <Refresh style={{ cursor: 'pointer' }} spinning={props.spinning} refresh={refresh} />
          {' '}
          <Close className="close_icon" close={onCancel} />
        </>
      )}
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ disabled: true }}
    >
      {children}
    </Modal>
  );
};

MyModal.defaultProps = {
  spinning: false,
  refresh: () => {},
};

export default MyModal;
