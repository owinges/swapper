import React, { FC, FormEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { SwapButton, SwapFooter, TokenInput } from '..';
import { Token, tokens } from '../TokenDropdown/tokenList';
import { abis } from '../../contracts';
import { UniswapService } from '../../services/uniswapService';
import { toast } from 'react-toastify';

const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: aliceblue 1px 0px 8px;
  max-width: 480px;
  padding: 8px;
  width: 100%;
`;

type SwapContainerProps = {
  loadWeb3Modal?: () => Promise<void>;
  provider?: Web3Provider;
};

export const SwapContainer: FC<SwapContainerProps> = ({ loadWeb3Modal, provider }) => {
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

      const accounts = await provider.listAccounts();
      const balance = await provider.getBalance(accounts[0]);

      const isInsufficient = Number(fromInputValue) > Number(formatEther(balance));

      setInsufficientFunds(isInsufficient);
    };

    checkInsufficientFunds();
  }, [fromInputValue, provider]);

  // Get the initial reserves whenever different tokens are selected.
  useEffect(() => {
    const getReserves = async () => {
      const uniswap = new UniswapService(provider);

      setLoadingReserves(true);

      const pairAddress = await uniswap.getPairAddress(fromToken.address, toToken.address);

      setPairAddress(pairAddress);

      const { reserves0, reserves1 } = await uniswap.getReservesForPair(pairAddress);

      setReserves({ reserves0, reserves1 });

      setLoadingReserves(false);
    };

    getReserves();
  }, [fromToken.address, provider, toToken.address]);

  // Subscribe to changes in reserves for the selected pair.
  useEffect(() => {
    const listenForChanges = async () => {
      if (!pairAddress) return;

      const defaultProvider = new UniswapService().defaultProvider;

      const exchangeContract = new Contract(pairAddress, abis.pair, defaultProvider);

      exchangeContract.on('Sync', (res0, res1) => {
        const reserves0 = Number(formatUnits(res0));
        const reserves1 = Number(formatUnits(res1));

        setReserves({ reserves0, reserves1 });
      });
    };

    listenForChanges();
  }, [pairAddress]);

  // Set prices whenever reserves change.
  useEffect(() => {
    if (!reserves) return;

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

      if (Number(target.value) > 0) {
        setIsLoadingToInput(true);

        const uniswap = new UniswapService(provider);
        const { toAmount } = await uniswap.getAmountsOut(target.value, [fromToken.address, toToken.address]);

        setIsLoadingToInput(false);

        setToInputValue(toAmount.toFixed(4));
      }
    } else {
      setToInputValue(target.value);

      if (Number(target.value) > 0) {
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
      await uniswap.handleSwap(fromInputValue, fromToken, toToken);
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