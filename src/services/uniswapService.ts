import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { AlchemyWebSocketProvider, Web3Provider } from '@ethersproject/providers';
import { formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { Token } from '../components/TokenDropdown/tokenList';
import { abis, addresses, MAINNET_ID } from '../contracts';

export class UniswapService {
  readonly defaultProvider = new AlchemyWebSocketProvider('mainnet', process.env.ALCHEMY_KEY);
  private _routerContract: Contract;

  constructor(private _provider: Web3Provider) {
    const signer = _provider.getSigner();

    this._routerContract = new Contract(addresses[MAINNET_ID].router02, abis.router02, signer);
  }

  async getAmountsOut(fromAmount: string, path: string[]) {
    const amountsOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(parseEther(fromAmount), path);

    return {
      fromAmount: Number(formatUnits(amountsOut[0])),
      toAmount: Number(formatUnits(amountsOut[1])),
    };
  }

  /**
   * Given an output asset amount and an array of token addresses, calculates all preceding minimum input token amounts
   * by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountIn.
   */
  async getAmountsIn(toAmount: string, path: string[]) {
    const amountsIn: [bigint, bigint] = await this._routerContract.callStatic.getAmountsIn(parseUnits(toAmount), path);

    return {
      fromAmount: Number(formatUnits(amountsIn[0])),
      toAmount: Number(formatUnits(amountsIn[1])),
    };
  }

  async handleSwap(fromInputValue: string, fromToken: Token, toToken: Token) {
    const accounts = await this._provider.listAccounts();
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = BigNumber.from(time);
    const amountIn = parseEther(fromInputValue);

    console.log('amountIn');
    console.log(amountIn);
    const amountOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

    console.log('amountOut');
    const amount0 = Number(formatUnits(amountOut[0]));
    const amount1 = Number(formatUnits(amountOut[1]));

    console.log('amount0 -> ', amount0);
    console.log('amount1 -> ', amount1);

    return await this._routerContract.swapExactETHForTokens(amountOut[1], [fromToken.address, toToken.address], accounts[0], deadline, {
      value: amountIn,
    });
  }

  async getPairAddress(fromTokenAddress: string, toTokenAddress: string) {
    const factory = await this._routerContract.factory();

    const factoryContract = new Contract(factory, abis.factory, this.defaultProvider);
    const pairFor: string = await factoryContract.getPair(fromTokenAddress.toLowerCase(), toTokenAddress.toLowerCase());

    console.log('pairFor:', pairFor);

    return pairFor;
  }

  async getReservesForPair(pairAddress: string) {
    const exchangeContract = new Contract(pairAddress, abis.pair, this.defaultProvider);
    const reserves: [bigint, bigint, bigint] = await exchangeContract.getReserves();

    return {
      reserves0: Number(formatUnits(reserves[0])),
      reserves1: Number(formatUnits(reserves[1])),
    };
  }
}
