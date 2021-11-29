import React, {Component} from 'react';
import commonStyles from '../../common/css/util.module.css';

type Props = {
  style:object,
  refresh:any,
  spinning?: boolean
}
class Refresh extends Component<Props> {
  private static defaultProps = {
    style:{}
  }
  render() {
    return (<svg style={this.props.style||{}} onClick={this.props.refresh} d="1629181477279" className={`icon ${this.props.spinning && commonStyles.spinning}`} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6530" width="24" height="24"><path d="M792.47 573.45c0 75.92-29.22 147.25-82.38 200.87-53.06 53.71-123.66 83.23-198.81 83.23-75.14 0-145.74-29.53-198.81-83.23-53.16-53.71-82.38-125.04-82.38-200.87s29.22-147.25 82.38-200.87c53.16-53.71 123.76-83.23 198.81-83.23 0.28 0-60.58 80.89-60.58 80.89-11.78 15.56-8.91 37.77 6.49 49.58 6.4 4.97 13.82 7.31 21.24 7.31 10.48 0 20.97-4.78 27.83-13.87L616.4 268.07c11.78-15.56 8.91-37.77-6.49-49.58L463.97 105.45c-15.4-11.9-37.39-8.9-49.08 6.56-11.78 15.56-8.91 37.77 6.49 49.58l73.94 57.27c-41.75 1.87-82.29 11.06-120.69 27.56-41.84 17.9-79.41 43.49-111.6 76.02-32.28 32.62-57.61 70.58-75.24 112.76-18.37 43.77-27.65 90.26-27.65 138.16s9.28 94.39 27.65 138.16c17.72 42.27 43.05 80.23 75.24 112.76 32.28 32.62 69.86 58.21 111.6 76.02 43.32 18.56 89.34 27.93 136.74 27.93s93.42-9.37 136.74-27.93c41.75-17.72 79.32-43.3 111.51-75.83 32.28-32.62 57.61-70.58 75.24-112.76 18.37-43.77 27.65-90.26 27.65-138.16 0.09-19.59-15.68-35.52-34.97-35.52-19.39-0.01-35.07 15.83-35.07 35.42z" p-id="6531" fill="#ffffff"/></svg>);;
  }
}
type CloseProps = {
  style?:any,
  close?:any,
  className?:any,
  onClick?:any
}
class Close extends Component<CloseProps> {
  static defaultProps = {
    style:{},
    close:()=>{}
  }
  render() {
    return (<svg {...this.props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 27"><text id="_" data-name="⇕" transform="translate(7 22)" fill="#fff" fontSize="20" fontFamily="SegoeUISymbol, Segoe UI Symbol" letterSpacing="0.3em"><tspan x="-6.152" y="0">⇕</tspan></text></svg>);
  }
}


export {
  Close,
  Refresh
}
