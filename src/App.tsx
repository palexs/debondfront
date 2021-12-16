import React, { Component } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Bank as Banks } from './views/bank/Bank';
import { Gov } from './views/gov/Gov';
import { Bonds } from './views/bonds/Bonds';
import Ref from './views/ref/Ref';
import './App.css';
import 'antd/dist/antd.css';
import { HeaderNav } from './components/header/HeaderNav';
import { Footers } from './components/footer/Footer';
import styles from './views/bank/css/bank.module.css';
import Info from './views/info/Info';
import Loan from './views/Loan/Loan';

type State = {
  provider: any,
  web3: Web3 | null,
};

type Props = any;
const { Content } = Layout;

export class App extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      provider: null,
      web3: null,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = async () => {
    let web3Provider;
    const windowNew = window as any;
    if (windowNew.ethereum) {
      web3Provider = windowNew.ethereum;
      try {
        // Requesting user Authorization
        await windowNew.ethereum.enable();
      } catch (error) {
        // The user is not authorized
        console.error('User denied account access');
        return;
      }
    } else if (windowNew.web3) {
      // original MetaMask Legacy dapp browsers...
      web3Provider = windowNew.web3.currentProvider;
    } else {
      alert('It is detected that there is no metamask plug-in in the current browser!');
      web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    const web3 = new Web3(web3Provider);

    // Extract the user from the Meta Mask
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const walletWithProvider = provider.getSigner();
    // this.walletWithProvider = walletWithProvider;
    // this.props.provider(walletWithProvider);
    // this.props.web3(web3);
    this.setState({
      provider: walletWithProvider,
      web3,
    });
  };

  setProvider = (provider: any) => {
    this.setState({
      provider,
    });
  };

  setWeb3 = (web3: Web3) => {
    this.setState({
      web3,
    });
  };

  render() {
    return (
      <Layout className="container_main">
        <Content>
          <Router basename="/">
            <Switch>
              <Route path="/" exact>
                <Info />
              </Route>
              <Route path="/bank">
                <div className={styles.header}><HeaderNav provider={this.setProvider} web3={this.setWeb3} /></div>
                <Banks provider={this.state.provider} web3={this.state.web3} />
              </Route>
              <Route path="/gov">
                <div className={styles.header}><HeaderNav provider={this.setProvider} web3={this.setWeb3} /></div>
                <Gov provider={this.state.provider} web3={this.state.web3} />
              </Route>
              <Route path="/bonds">
                <div className={styles.header}><HeaderNav provider={this.setProvider} web3={this.setWeb3} /></div>
                <Bonds provider={this.setProvider} />
              </Route>
              <Route path="/loan">
                <div className={styles.header}><HeaderNav provider={this.setProvider} web3={this.setWeb3} /></div>
                <Loan provider={this.state.provider} />
              </Route>
              <Route path="/ref">
                <div className={styles.header}><HeaderNav provider={this.setProvider} web3={this.setWeb3} /></div>
                <Ref provider={this.state.provider} />
              </Route>
            </Switch>
            <Footers />
          </Router>
        </Content>
      </Layout>
    );
  }
}

export default App;
