import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import { Contract } from 'ethers';
import MyModal from '../Modal/Index';
import { bar_styles, make_bar } from '../../eigma-cash/format_util';
import dexTest from '../../eigma-cash/deployments/dexTest.json';
import config from '../../config-production';

type Props = {
  visible:boolean,
  onCancel:any,
  provider?: any
}

class UnderConstructionModal extends Component<Props> {
  private bank: any;

  private address: string = config.externalTokens.dexTest[0];

  state = {
    maxsize: 70,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this)); // 监听窗口大小改变
    const clientW = document.documentElement.clientWidth;
    this.handleClientW(clientW, 750);
  }

  async getData() {
    if (!this.props.provider) return;
    this.bank = new Contract(this.address, dexTest, this.props.provider);

    const isActive = await this.bank.isActive(true);
    const result = await this.bank.getERC20LoanAuction(0, 20000);
  }

  handleResize = (e:any) => {
    const e_width = e.target.innerWidth;
    this.handleClientW(e_width, 750);
  };

  handleClientW = (width:any, num:any) => {
    if (width <= 750) {
      this.setState({
        maxsize: 20,
      });
    } else if (width >= 750 && width <= 960) {
      this.setState({
        maxsize: 40,
      });
    } else if (width >= 960 && width <= 1024) {
      this.setState({
        maxsize: 60,
      });
    } else {
      this.setState({
        maxsize: 70,
      });
    }
  };

  render() {
    return (
      <MyModal title="under construction... " visible={this.props.visible} onCancel={this.props.onCancel}>
        <Row style={{ padding: '0 20px' }}>
          <Col style={{ textAlign: 'center' }} span={24}>
            <p> </p>
            <p style={{ fontSize: 20 }}>At present, our system is under construction and 36% has been completed </p>
            <p style={{ marginBottom: 100 }}>
              {make_bar(36, bar_styles[8], 7, this.state.maxsize).str}
              {' '}
              36%
            </p>
          </Col>
        </Row>
        <Row>
          <Button
            style={{
              background: '#403af4 ', color: '#fff', borderColor: '#333', position: 'absolute', right: 20, bottom: 20,
            }}
            size="large"
            onClick={this.props.onCancel}
            type="default"
          >
            Back
          </Button>
        </Row>
      </MyModal>
    );
  }
}

export default UnderConstructionModal;
