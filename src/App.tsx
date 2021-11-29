import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

type IMyComponentState = {
  provider: any,
  mobile:boolean
};

type IMyComponentProps = {};
const { Content } = Layout;

export class App extends React.Component<IMyComponentProps,
  IMyComponentState> {
  public constructor(props?: any) {
    super(props);
    this.state = {
      provider: null,
      mobile: false,
    };
  }

  public setProvider = (provider: any) => {
    this.setState({
      provider,
    });
  };

  public render() {
    // /background: "linear-gradient(#000 60%, #1f1c20)",
    return (
      <Layout className="container_main" style={{}}>
        <Content>
          <Router basename="/">
            {/* <div className={styles.header}><HeaderNav provider={this.setProvider}/></div> */}
            <Switch>
              <Route path="/" exact>
                <Info />
              </Route>
              <Route path="/bank">
                <div className={styles.header}><HeaderNav provider={this.setProvider} /></div>
                <Banks provider={this.state.provider} />
              </Route>
              <Route path="/gov">
                <div className={styles.header}><HeaderNav provider={this.setProvider} /></div>
                <Gov provider={this.state.provider} />
              </Route>
              <Route path="/bonds">
                <div className={styles.header}><HeaderNav provider={this.setProvider} /></div>
                <Bonds provider={this.setProvider} />
              </Route>
              <Route path="/loan">
                <div className={styles.header}><HeaderNav provider={this.setProvider} /></div>
                <Loan provider={this.state.provider} />
              </Route>
              <Route path="/ref">
                <div className={styles.header}><HeaderNav provider={this.setProvider} /></div>
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
