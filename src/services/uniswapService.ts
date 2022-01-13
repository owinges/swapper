import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { AlchemyWebSocketProvider, Web3Provider } from '@ethersproject/providers';
import { formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { Token, tokens } from '../components/TokenDropdown/tokenList';
import { abis, commonContracts } from '../contracts';

export class UniswapService {
  readonly defaultProvider = new AlchemyWebSocketProvider('mainnet', process.env.REACT_APP_ALCHEMY_KEY);
  private _routerContract: Contract;

  constructor(private _provider?: Web3Provider) {
    if (_provider) {
      const signer = _provider.getSigner();

      this._routerContract = new Contract(commonContracts.router02, abis.router02, signer);
    } else {
      this._routerContract = new Contract(commonContracts.router02, abis.router02, this.defaultProvider);
    }
  }

  async getAmountsOut(fromAmount: string, path: string[]) {
    const fromDecimals = tokens.find((token) => token.address === path[0])?.decimals;
    const toDecimals = tokens.find((token) => token.address === path[1])?.decimals;

    const amountsOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(parseUnits(fromAmount, fromDecimals), path);

    return {
      fromAmount: Number(formatUnits(amountsOut[0], fromDecimals)),
      toAmount: Number(formatUnits(amountsOut[1], toDecimals)),
    };
  }

  /**
   * Given an output asset amount and an array of token addresses, calculates all preceding minimum input token amounts
   * by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountIn.
   */
  async getAmountsIn(toAmount: string, path: string[]) {
    const fromDecimals = tokens.find((token) => token.address === path[0])?.decimals;
    const toDecimals = tokens.find((token) => token.address === path[1])?.decimals;

    const amountsIn: [bigint, bigint] = await this._routerContract.callStatic.getAmountsIn(parseUnits(toAmount, toDecimals), path);

    return {
      fromAmount: Number(formatUnits(amountsIn[0], fromDecimals)),
      toAmount: Number(formatUnits(amountsIn[1], toDecimals)),
    };
  }

  async checkTokenAllowance(tokenAddress: string): Promise<number | undefined> {
    if (!this._provider) return;

    const signer = this._provider.getSigner();
    const tokenContract = new Contract(tokenAddress, abis.erc20, signer);

    const accounts = await this._provider.listAccounts();

    const remainingAllowance = await tokenContract.allowance(accounts[0], commonContracts.router02);

    return Number(remainingAllowance);
  }

  async approveTokenTransfer(tokenAddress: string) {
    if (!this._provider) return;

    const signer = this._provider.getSigner();
    const tokenContract = new Contract(tokenAddress, abis.erc20, signer);

    // Highest possible amount; in effect an unlimited allowance.
    const amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

    return await tokenContract.approve(commonContracts.router02, amount);
  }

  async swapExactETHForTokens(fromInputValue: string, fromToken: Token, toToken: Token) {
    if (!this._provider) return;

    const accounts = await this._provider.listAccounts();
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = BigNumber.from(time);
    const amountIn = parseEther(fromInputValue);

    const amountOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

    return await this._routerContract.swapExactETHForTokens(amountOut[1], [fromToken.address, toToken.address], accounts[0], deadline, {
      value: amountIn,
    });
  }

  async swapExactTokensForETH(fromInputValue: string, fromToken: Token, toToken: Token) {
    if (!this._provider) return;

    const accounts = await this._provider.listAccounts();
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = BigNumber.from(time);
    const amountIn = parseUnits(fromInputValue);

    const amountOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

    return await this._routerContract.swapExactTokensForETH(
      amountIn,
      amountOut[1],
      [fromToken.address, toToken.address],
      accounts[0],
      deadline,
    );
  }

  async swapExactTokensForTokens(fromInputValue: string, fromToken: Token, toToken: Token) {
    if (!this._provider) return;

    const accounts = await this._provider.listAccounts();
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = BigNumber.from(time);
    const amountIn = parseUnits(fromInputValue);

    const amountOut: [bigint, bigint] = await this._routerContract.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

    return await this._routerContract.swapExactTokensForTokens(
      amountIn,
      amountOut[1],
      [fromToken.address, toToken.address],
      accounts[0],
      deadline,
    );
  }

  async getPairAddress(fromTokenAddress: string, toTokenAddress: string): Promise<string> {
    const factory = await this._routerContract.factory();
    const factoryContract = new Contract(factory, abis.factory, this._provider || this.defaultProvider);

    return await factoryContract.getPair(fromTokenAddress, toTokenAddress);
  }

  async getReservesForPair(pairAddress: string, decimals0: number, decimals1: number, flipped: boolean) {
    const pairContract = new Contract(pairAddress, abis.pair, this._provider || this.defaultProvider);
    const reserves: [bigint, bigint, bigint] = await pairContract.getReserves();

    if (flipped) {
      return {
        reserves0: Number(formatUnits(reserves[0], decimals1)),
        reserves1: Number(formatUnits(reserves[1], decimals0)),
      };
    }

    return {
      reserves0: Number(formatUnits(reserves[0], decimals0)),
      reserves1: Number(formatUnits(reserves[1], decimals1)),
    };
  }
}
