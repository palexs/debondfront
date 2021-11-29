import React, {Component} from 'react';
import styles from '@views/Loan/css/loan.module.css';
import Content from './components/Content';
type LoanProps = {
  provider:any
}


class Loan extends Component<LoanProps> {
  render() {
    return (
      <div>
        <div className={styles.content}>
          <Content provider={this.props.provider} />
        </div>
      </div>
    );
  }
}

export default Loan;
