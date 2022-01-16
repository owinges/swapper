// Non-null assertions for context.state.routerContract are fine because it's assigned a value before anything uses it.
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, FC, useCallback, useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { AlchemyWebSocketProvider, Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { abis, commonContracts } from '../contracts';
import { Token, tokens } from '../components/TokenDropdown/tokenList';
import { formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

interface Action {
  type: 'set_provider' | 'set_router_contract';
  payload: any | undefined;
}

type Dispatch = (action: Action) => void;

type State = {
  defaultProvider: AlchemyWebSocketProvider;
  provider: Web3Provider | undefined;
  routerContract: Contract | undefined;
};

type UniswapProviderProps = { children: React.ReactNode };

const initialState: State = {
  defaultProvider: new AlchemyWebSocketProvider('mainnet', process.env.REACT_APP_ALCHEMY_KEY),
  provider: undefined,
  routerContract: undefined,
};

const UniswapContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function uniswapReducer(state: State, action: Action) {
  switch (action.type) {
    case 'set_provider':
      return { ...state, provider: action.payload };
    case 'set_router_contract':
      return { ...state, routerContract: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const UniswapProvider: FC<UniswapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uniswapReducer, initialState);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch };

  useEffect(() => {
    if (!state.provider) return;

    const provider = new Web3Provider(window.ethereum, 'any');

    provider?.on('network', (newNetwork, oldNetwork) => {
      // If the user isn't connected to Ethereum mainnet, show an error and request that MetaMask prompts the user to switch.
      if (newNetwork.chainId !== 1) {
        // TODO: Instead of showing a toast, change this to a modal that blocks the user from doing anything.
        toast.error('You must connect to Ethereum mainnet to use this app!', { toastId: 'wrong-network' });

        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        });
      }

      if (oldNetwork) {
        // Reload when the network has changed so as to avoid potential issues.
        window.location.reload();
      }
    });
  }, [state.provider]);

  useEffect(() => {
    let payload: Contract;

    if (state.provider) {
      const signer = state.provider.getSigner();

      payload = new Contract(commonContracts.router02, abis.router02, signer);
    } else {
      payload = new Contract(commonContracts.router02, abis.router02, state.defaultProvider);
    }

    dispatch({ type: 'set_router_contract', payload });
  }, [state.defaultProvider, state.provider]);

  return <UniswapContext.Provider value={value}>{children}</UniswapContext.Provider>;
};

// HOOKS
const useUniswapContext = () => {
  const context = useContext(UniswapContext);

  if (!context) {
    throw new Error('useUniswap must be used within a UniswapProvider!');
  }

  return context;
};

export const useUniswap = () => {
  const {
    dispatch,
    state: { defaultProvider, provider, routerContract },
  } = useUniswapContext();

  const setProvider = (provider: Web3Provider) => {
    dispatch({ type: 'set_provider', payload: provider });
  };

  const getPairAddress = useCallback(
    async (fromTokenAddress: string, toTokenAddress: string): Promise<string> => {
      const factory = await routerContract!.factory();
      const factoryContract = new Contract(factory, abis.factory, provider || defaultProvider);

      return await factoryContract.getPair(fromTokenAddress, toTokenAddress);
    },
    [defaultProvider, provider, routerContract],
  );

  const getReservesForPair = useCallback(
    async (pairAddress: string, decimals0: number, decimals1: number, flipped: boolean) => {
      const pairContract = new Contract(pairAddress, abis.pair, provider || defaultProvider);
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
    },
    [defaultProvider, provider],
  );

  const getAmountsOut = useCallback(
    async (fromAmount: string, path: string[]) => {
      const fromDecimals = tokens.find((token) => token.address === path[0])?.decimals;
      const toDecimals = tokens.find((token) => token.address === path[1])?.decimals;

      const amountsOut: [bigint, bigint] = await routerContract!.callStatic.getAmountsOut(parseUnits(fromAmount, fromDecimals), path);

      return {
        fromAmount: Number(formatUnits(amountsOut[0], fromDecimals)),
        toAmount: Number(formatUnits(amountsOut[1], toDecimals)),
      };
    },
    [routerContract],
  );

  /**
   * Given an output asset amount and an array of token addresses, calculates all preceding minimum input token amounts
   * by calling getReserves for each pair of token addresses in the path in turn, and using these to call getAmountIn.
   */
  const getAmountsIn = useCallback(
    async (toAmount: string, path: string[]) => {
      const fromDecimals = tokens.find((token) => token.address === path[0])?.decimals;
      const toDecimals = tokens.find((token) => token.address === path[1])?.decimals;

      const amountsIn: [bigint, bigint] = await routerContract!.callStatic.getAmountsIn(parseUnits(toAmount, toDecimals), path);

      return {
        fromAmount: Number(formatUnits(amountsIn[0], fromDecimals)),
        toAmount: Number(formatUnits(amountsIn[1], toDecimals)),
      };
    },
    [routerContract],
  );

  const checkTokenAllowance = useCallback(
    async (tokenAddress: string): Promise<number | undefined> => {
      if (!provider) return;

      const signer = provider.getSigner();
      const tokenContract = new Contract(tokenAddress, abis.erc20, signer);
      const accounts = await provider.listAccounts();
      const remainingAllowance = await tokenContract.allowance(accounts[0], commonContracts.router02);

      return Number(remainingAllowance);
    },
    [provider],
  );

  const approveTokenTransfer = useCallback(
    async (tokenAddress: string) => {
      if (!provider) return;

      const signer = provider.getSigner();
      const tokenContract = new Contract(tokenAddress, abis.erc20, signer);

      // Highest possible amount; in effect an unlimited allowance.
      const amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

      return await tokenContract.approve(commonContracts.router02, amount);
    },
    [provider],
  );

  const swapExactETHForTokens = useCallback(
    async (fromInputValue: string, fromToken: Token, toToken: Token) => {
      if (!provider) return;

      const accounts = await provider.listAccounts();
      const time = Math.floor(Date.now() / 1000) + 200000;
      const deadline = BigNumber.from(time);
      const amountIn = parseEther(fromInputValue);
      const amountOut: [bigint, bigint] = await routerContract!.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

      return await routerContract!.swapExactETHForTokens(amountOut[1], [fromToken.address, toToken.address], accounts[0], deadline, {
        value: amountIn,
      });
    },
    [provider, routerContract],
  );

  const swapExactTokensForETH = useCallback(
    async (fromInputValue: string, fromToken: Token, toToken: Token) => {
      if (!provider) return;

      const accounts = await provider.listAccounts();
      const time = Math.floor(Date.now() / 1000) + 200000;
      const deadline = BigNumber.from(time);
      const amountIn = parseUnits(fromInputValue);
      const amountOut: [bigint, bigint] = await routerContract!.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

      return await routerContract!.swapExactTokensForETH(
        amountIn,
        amountOut[1],
        [fromToken.address, toToken.address],
        accounts[0],
        deadline,
      );
    },
    [provider, routerContract],
  );

  const swapExactTokensForTokens = useCallback(
    async (fromInputValue: string, fromToken: Token, toToken: Token) => {
      if (!provider) return;

      const accounts = await provider.listAccounts();
      const time = Math.floor(Date.now() / 1000) + 200000;
      const deadline = BigNumber.from(time);
      const amountIn = parseUnits(fromInputValue);
      const amountOut: [bigint, bigint] = await routerContract!.callStatic.getAmountsOut(amountIn, [fromToken.address, toToken.address]);

      return await routerContract!.swapExactTokensForTokens(
        amountIn,
        amountOut[1],
        [fromToken.address, toToken.address],
        accounts[0],
        deadline,
      );
    },
    [provider, routerContract],
  );

  return {
    defaultProvider,
    provider,
    setProvider,
    getPairAddress,
    getReservesForPair,
    getAmountsOut,
    getAmountsIn,
    checkTokenAllowance,
    approveTokenTransfer,
    swapExactETHForTokens,
    swapExactTokensForETH,
    swapExactTokensForTokens,
  };
};
