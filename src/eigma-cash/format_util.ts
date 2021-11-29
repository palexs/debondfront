import { BigNumber } from 'ethers';
import Web3 from 'web3';

export const getDisplayBalance = (balance: BigNumber, fractionDigits: any, decimals = 18) => {
  const number = getBalance(balance, decimals - fractionDigits);
  return (number / 10 ** fractionDigits).toFixed(fractionDigits);
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => getDisplayBalance(balance, decimals);

export const roundFun = (value: any, n: any) => Math.round(value * 10 ** n) / 10 ** n;

export function getBalance(balance: BigNumber, decimals = 18): number {
  if (balance) {
    return balance.div(BigNumber.from(10).pow(decimals)).toNumber();
  }
  return 0;
}
export async function getChainId(address:any) {
  const web3 = new Web3('https://http-mainnet.hecochain.com');
  const balance = await web3.eth.getBalance(address);
  const chainId = await web3.eth.getChainId();
  return { chainId, balance, address };
}

const windowNew = window as any;
export async function handleBalance() {
  const address = await windowNew.ethereum.request({ method: 'eth_requestAccounts' });
  return await getChainId(address[0]);
}
function repeat(s:number, i:number) {
  let r = '';
  for (let j = 0; j < i; j++) r += s;
  return r;
}

/**
 * Character progress bar component
 * @param {number} p The current progress
 * @param {array} bar_style Progress bar Style
 * @param {number} min_size The minimum
 * @param {number} max_size The maximum
 * */
export function make_bar(p:number, bar_style:any, min_size:number, max_size:number) {
  let d; let full; let m; let middle; let r; let rest; let x;
  let min_delta = Number.POSITIVE_INFINITY;
  const full_symbol = bar_style[bar_style.length - 1];
  const n = bar_style.length - 1;
  if (p == 100) return { str: repeat(full_symbol, 10), delta: 0 };
  p /= 100;
  for (let i = max_size; i >= min_size; i--) {
    x = p * i;
    full = Math.floor(x);
    rest = x - full;
    middle = Math.floor(rest * n);
    if (p != 0 && full == 0 && middle == 0) middle = 1;
    d = Math.abs(p - (full + middle / n) / i) * 100;
    if (d < min_delta) {
      min_delta = d;
      m = bar_style[middle];
      if (full == i) m = '';
      r = repeat(full_symbol, full) + m + repeat(bar_style[0], i - full - 1);
    }
  }
  return { str: r, delta: min_delta };
}

export const bar_styles = [
  '▁▂▃▄▅▆▇█', '⣀⣄⣤⣦⣶⣷⣿', '⣀⣄⣆⣇⣧⣷⣿', '○◔◐◕⬤', '□◱◧▣■', '□◱▨▩■',
  '□◱▥▦■',
  '░▒▓█',
  '░█',
  '⬜⬛',
  '▱▰',
  '▭◼',
  '▯▮',
  '◯⬤',
  '⚪⚫',
];
