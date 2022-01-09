import React, { FC, FormEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
import { AlchemyWebSocketProvider, Web3Provider } from '@ethersproject/providers';
import { SwapButton, SwapFooter, TokenInput } from '..';
import { Token, tokens } from '../TokenDropdown/tokenList';
import { abis } from '../../contracts';
import { UniswapService } from '../../services/uniswapService';
import { toast } from 'react-toastify';

const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  /* box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px; */
  max-width: 480px;
  padding: 8px;
  width: 100%;
`;

type SwapProps = {
  loadWeb3Modal?: () => Promise<void>;
  provider?: Web3Provider;
};

export const Swap: FC<SwapProps> = ({ loadWeb3Modal, provider }) => {
  const [fromToken, setFromToken] = useState(tokens.find((token) => token.symbol === 'WETH')!);
  const [toToken, setToToken] = useState<Token>(tokens[0]);
  const [pairAddress, setPairAddress] = useState<string>();
  const [reserves, setReserves] = useState<{
    reserves0: number;
    reserves1: number;
  }>();

  const [loadingReserves, setLoadingReserves] = useState(false);

  const [fromInputValue, setFromInputValue] = useState<string>('');
  const [toInputValue, setToInputValue] = useState<string>('');

  const [prices, setPrices] = useState<{
    fromToken: number;
    toToken: number;
  }>();

  const [insufficientFunds, setInsufficientFunds] = useState(false);

  useEffect(() => {
    const checkInsufficientFunds = async () => {
      if (!provider) return;

      console.log('checking for insufficient funds');

      const accounts = await provider.listAccounts();
      const balance = await provider.getBalance(accounts[0]);

      const isInsufficient = Number(fromInputValue) > Number(formatEther(balance));

      if (isInsufficient) {
        console.log('funds are insufficient');
      } else {
        console.log('funds are NOT insufficient');
      }

      setInsufficientFunds(isInsufficient);
    };

    checkInsufficientFunds();
  }, [fromInputValue, provider]);

  // Get the initial reserves whenever different tokens are selected.
  useEffect(() => {
    const getReserves = async () => {
      if (!provider) return;

      console.log('getting new reserves');

      const uniswap = new UniswapService(provider);

      setLoadingReserves(true);

      const pairAddress = await uniswap.getPairAddress(fromToken.address, toToken.address);

      setPairAddress(pairAddress);

      const { reserves0, reserves1 } = await uniswap.getReservesForPair(pairAddress);

      console.log('setting new reserves');

      setReserves({ reserves0, reserves1 });

      setLoadingReserves(false);
    };

    getReserves();
  }, [fromToken.address, provider, toToken.address]);

  // Subscribe to changes in reserves for the selected pair.
  useEffect(() => {
    const listenForChanges = async () => {
      if (!pairAddress) return;

      const defaultProvider = new AlchemyWebSocketProvider('mainnet', 'FUVN4YGFMCDIldERfaEGXkR6KhA5Grj8');

      const exchangeContract = new Contract(pairAddress, abis.pair, defaultProvider);

      console.log(`there are currently ${exchangeContract.listeners.length} active listeners`);
      // exchangeContract.removeAllListeners();

      exchangeContract.on('Sync', (res0, res1) => {
        const reserves0 = Number(formatUnits(res0));
        const reserves1 = Number(formatUnits(res1));

        console.log('setting updated reserves');

        setReserves({ reserves0, reserves1 });
      });
    };

    listenForChanges();
  }, [pairAddress]);

  // Set prices whenever reserves change.
  useEffect(() => {
    if (!reserves) return;

    console.log('setting prices');

    setPrices({
      fromToken: reserves?.reserves0 / reserves?.reserves1,
      toToken: reserves?.reserves1 / reserves?.reserves0,
    });
  }, [reserves]);

  const [isLoadingFromInput, setIsLoadingFromInput] = useState(false);
  const [isLoadingToInput, setIsLoadingToInput] = useState(false);

  // TODO: Debounce this to prevent requests from being sent for each keystroke.
  const handleInputChange = async (event: FormEvent) => {
    const target = event.target as HTMLInputElement;

    if (target.id === 'fromInput') {
      setFromInputValue(target.value);

      if (provider && Number(target.value) > 0) {
        setIsLoadingToInput(true);

        const uniswap = new UniswapService(provider);
        const { toAmount } = await uniswap.getAmountsOut(target.value, [fromToken.address, toToken.address]);

        setIsLoadingToInput(false);

        setToInputValue(toAmount.toFixed(4));
      }
    } else {
      setToInputValue(target.value);

      if (provider && Number(target.value) > 0) {
        setIsLoadingFromInput(true);

        const uniswap = new UniswapService(provider);
        const { fromAmount } = await uniswap.getAmountsIn(target.value, [fromToken.address, toToken.address]);

        setIsLoadingFromInput(false);

        setFromInputValue(fromAmount.toFixed(4));
      }
    }
  };

  const handleSwap = async () => {
    if (!provider) return;

    const uniswap = new UniswapService(provider);

    try {
      const result = await uniswap.handleSwap(fromInputValue, fromToken, toToken);

      console.log(result);
    } catch (exception: any) {
      if (exception.code === 'INSUFFICIENT_FUNDS') {
        toast.error('You have insufficient funds for this swap.');
      } else {
        toast.error('Something went wrong with the swap you attempted.');
      }
    }
  };

  return (
    <Container>
      <TokenInput
        id="fromInput"
        isLoading={isLoadingFromInput}
        onInputChange={handleInputChange}
        onTokenSelect={setFromToken}
        provider={provider}
        selectedToken={fromToken}
        value={fromInputValue}
      />
      <TokenInput
        id="toInput"
        isLoading={isLoadingToInput}
        onInputChange={handleInputChange}
        onTokenSelect={setToToken}
        provider={provider}
        selectedToken={toToken}
        value={toInputValue}
      />
      <SwapFooter fromToken={fromToken} prices={prices} toToken={toToken} loading={loadingReserves} />
      <SwapButton insufficientFunds={insufficientFunds} loadWeb3Modal={loadWeb3Modal} onSwap={handleSwap} provider={provider} />
    </Container>
  );
};
