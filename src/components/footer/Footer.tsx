import React from 'react';
import styles from './css/footer.module.css';
import icon1 from '../../assets/icon1.png';
import icon2 from '../../assets/icon2.png';
import icon3 from '../../assets/icon3.png';
import icon4 from '../../assets/icon4.png';
import icon5 from '../../assets/icon5.png';
import icon6 from '../../assets/icon6.png';
import icon7 from '../../assets/icon7.png';
import logo1 from '../../assets/logo_footer.png';
import UnderConstructionModal from '../UnderConstructionModal/UnderConstructionModal';

type IMyComponentState = {}
type IMyComponentProps = {}

export class Footers extends React.Component<IMyComponentProps, IMyComponentState> {
  state = {
    visible: false,
  };

  public handleLink = () => {
    const list = [
      { target: '_blank', name: 'About', link: 'https://sigma-protocol.medium.com/introducing-sigma-protocol-a-bond-based-decentralized-monetary-model-626801006af0' },
      { target: '_blank', name: 'Github', link: 'https://github.com/Sigmoid-Protocol/' },
      { target: '_blank', name: 'Telegram', link: 'https://t.co/HjENgoB8Gr?amp=1' },
      { target: '_blank', name: 'Discord', link: 'https://discord.gg/GYdhhMhV' },
      { target: '', name: 'Roadmap', link: '##' },
      { target: '', name: 'Whitepaper', link: '##' },
      { target: '_blank', name: 'Medium', link: 'https://sigma-protocol.medium.com/' },
      { target: '_blank', name: 'Twitter', link: 'https://twitter.com/ProtocolSigma' },
      { target: '', name: 'Charts', link: '##' },
      { target: '_blank', name: 'Contact', link: 'mailto:info@sgm.finance' },
      { target: '', name: 'Governance Forum', link: '##' },
      { target: '', name: 'Voting Portal', link: '##' },
      { target: '', name: 'Documentation', link: '##' },
      { target: '', name: 'Community', link: '##' },
      { target: '', name: 'Reddit', link: '##' },
      { target: '', name: 'Blog', link: '##' },
      { target: '', name: 'FAQ', link: '##' },
      { target: '', name: 'Help & Tutorials', link: '##' },
      { target: '', name: 'Logo & Brand', link: '##' },
    ];
    return list.map((item, i) => (
      <a
        href={item.link}
        target={item.target}
        onClick={(e) => {
          if (item.link == '##') {
            // e.target.
            this.handleStatus();
            return false;
          }
        }}
        key={i}
        style={{ margin: '10px auto', width: 'fit-content', color: '#fff' }}
      >
        {item.name}
      </a>
    ));
  };

  /**
   * Popover status switch
   * */
  public handleStatus = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  /**
   * Build a popover
   * */
  public modal = () => (
    <UnderConstructionModal onCancel={this.handleStatus} visible={this.state.visible} />
  );

  public render() {
    return (
      <div className={styles.footerWrapper}>
        <div className={styles.footer}>
          <div className={styles.item1}>
            <div className={styles.item1_item}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 65 71"
                width="100"
              >
                <defs>
                  <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 338 370">
                    <image
                      width="338"
                      height="370"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVIAAAFyCAMAAACQp6LrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURQAAAP///////////////////////////////////////////////////////////////7eV4oIAAAAQdFJOUwAQIDBAUGBwf4+fr7/P3+8FUYRsAAAACXBIWXMAABcRAAAXEQHKJvM/AAAMMklEQVR4Xu2c7ZqyOgxFQUFBQbz/qx0q9RsE2t1sJk/WL8+cd6QumyZpYTJZ8n15PNanpm0vneN6o8l3+6KsTs3wn/G4t760zfl8qg5F4a+tjd5l1bRe4SeN/0dZtiur1v8QyeXcq/WX0EBeHE9TMgeeSm+UJ/9zMJdTpcBrXlS/bd74UNqTyur1eq7/s9ZFOh3fSnuOKVaAgfO/nK15US9XMqq0/0qSTdU+gf2zydr7XDY9PRNK+2yVUOr1eir9ZTZPUV/8mJcyqTS11Gu999fZMPkhYAn8oTTL9mmltkd/nY2yMuDv/FSaZYe1s34l9c5faHsUoTl6RmmWpZ2o/QAO/kKbIi/Di55Zpdk+8US9tpuTGrSEPphXmn6iXi+bkpqXcZNoidLs6P9xOrrtSA1eQ+8sUpo++DcT/tFClyrNctjm3zQtv6nKaz+WGBYqzTLExeY4cUuqPKwO/WSx0qzyv5GU2l+MASDmbyxXKuO0ZTX/kJi/sUJpVvjfSQtnoha4BLxGqZBTQkGFm6I9q5RmB/9biZGeqMAp2rNOqUDRf6OTrKdAif7BSqXpm1NP5a+XnvzsL4lirdIMPYApWqEaFRv0jtVKM1D1NotM8B+xQe9YrzRP3+970m/65ynWsfVKs73/1fQEDG4V8GX0RsiohUqpnrQLaqL9taCJIJWi+gU14TFqgV9GbwQplVtOr9dkPX+CxDQQtlzJdKYDiZJUuqYlMANI7J7eSVL1J9xWC1QqGfopnKZsAgOVioZ+8CCnSFKOPggerVzW7wE7TbtRETzY3L+BDFCnibd+wscqcm7yAOg0dWoNH6pohgI6TT4VIkYq15feAG31p99Ej/nyZacpppYSOJaIUVr695ACcMxXpupCX4haooSnaXy/vxcwGqdUeDW9XiP3pWQyapRS8WnaRe2fptlx/iJOqfg0bf2FgxDa64lTmkusTW+c/ZUD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"
                    />
                  </pattern>
                </defs>
                <rect id="Picture2" width="65" height="71" fill="url(#pattern)" />
              </svg>
            </div>
            <div className={styles.item1_item}>
              <div className={styles.item1_item_font}>Info</div>
              <a
                className={styles.link}
                href="https://sigma-protocol.medium.com/introducing-sigma-protocol-a-bond-based-decentralized-monetary-model-626801006af0"
                target="_blank"
                rel="noreferrer"
              >
                About
              </a>
              <a className={styles.link} onClick={this.handleStatus}>Charts</a>
              <a className={styles.link} href="mailto:info@sgm.finance">Contact</a>
              <a className={styles.link} onClick={this.handleStatus}>Join us</a>
            </div>
            <div className={styles.item1_item}>
              <div className={styles.item1_item_font}>Tech</div>
              <a className={styles.link} href="https://github.com/Sigmoid-Protocol/" target="_blank" rel="noreferrer">Github</a>
              <a className={styles.link} href="https://eips.ethereum.org/EIPS/eip-3475" target="_blank" rel="noreferrer">ERC-3475</a>
              <a className={styles.link} onClick={this.handleStatus}>Roadmap</a>
              <a className={styles.link} onClick={this.handleStatus}>White paper</a>
            </div>
          </div>
          <div className={styles.item2}>
            <div className={styles.item2_item}>
              <a target="_blank" href=" https://twitter.com/ProtocolSigma">
                <img
                  src={icon1}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" href=" https://sigma-protocol.medium.com/">
                <img
                  src={icon2}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" onClick={this.handleStatus}>
                <img
                  src={icon3}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" onClick={this.handleStatus}>
                <img
                  src={icon4}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" href="https://github.com/Sigmoid-Protocol/" rel="noreferrer">
                <img
                  src={icon5}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" href="https://t.me/sigma_protocol" rel="noreferrer">
                <img
                  src={icon6}
                />
              </a>
            </div>
            <div className={styles.item2_item}>
              <a target="_blank" href="https://discord.gg/GYdhhMhV" rel="noreferrer">
                <img
                  src={icon7}
                />
              </a>
            </div>
          </div>
          <div className={styles.item4}>
            {/* <div>About</div>
                        <div>Github</div>
                        <div>Telegran</div>
                        <div>Discord</div>
                        <div>Roadmap</div>
                        <div>Whitepaper</div>
                        <div>Medium</div>
                        <div>Twitter</div>
                        <div>Charts</div>
                        <div>Contact</div> */}
            {this.handleLink()}
          </div>
          <div className={styles.item3}>
            <p>© 2021 Sigmoid Labs, All Rights Reserved </p>
            <p> Security Report Privacy and Cookies Cookie Settings</p>
          </div>

        </div>
        {this.modal()}
      </div>
    );
  }
}
