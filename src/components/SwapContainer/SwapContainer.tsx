import React, { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
import debounce from 'lodash.debounce';
import { SwapButton, SwapFooter, TokenInput } from '..';
import { abis } from '../../contracts';
import { Token, tokens } from '../TokenDropdown/tokenList';
import { useUniswap } from '../../context/UniswapContext';

const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: aliceblue 1px 0px 8px;
  max-width: 480px;
  padding: 8px;
  width: 100%;
`;

const FlipButton = styled.button`
  background-color: ${({ theme }) => theme.colors.grayLighter};
  border: 4px solid ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  cursor: pointer;
  height: 32px;
  left: calc(50% - 16px);
  padding: 4px;
  position: absolute;
  transform: translateY(-20px);
  transition: ${({ theme }) => theme.transition};
  width: 32px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayLight};
    transform: translateY(-20px) rotate(180deg);
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.grayDark};
    transform: translateY(-20px) rotate(180deg) scale(0.9);
  }
`;

export const SwapContainer: FC = () => {
  const {
    defaultProvider,
    provider,
    getPairAddress,
    getReservesForPair,
    checkTokenAllowance,
    getAmountsOut,
    getAmountsIn,
    approveTokenTransfer,
    swapExactETHForTokens,
    swapExactTokensForETH,
    swapExactTokensForTokens,
  } = useUniswap();

  // Non-null assertion is fine because the tokens array is static and WETH is in it.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [fromToken, setFromToken] = useState(tokens.find((token) => token.symbol === 'WETH')!);
  const [toToken, setToToken] = useState<Token>();
  const [pairAddress, setPairAddress] = useState<string>();
  const [tokenIsApproved, setTokenIsApproved] = useState(true);
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
    if (!toToken) return;

    const getReserves = async () => {
      setLoadingReserves(true);

      const pairAddress = await getPairAddress(fromToken.address, toToken.address);

      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        console.log('There is no pair for these tokens.');
      } else {
        setPairAddress(pairAddress);

        // Uniswap arranges reserves by each address' size, with the smallest being first.
        const flipped = BigNumber.from(fromToken.address).gt(BigNumber.from(toToken.address));

        const { reserves0, reserves1 } = await getReservesForPair(pairAddress, fromToken.decimals, toToken.decimals, flipped);

        setReserves({ reserves0, reserves1 });
      }

      setLoadingReserves(false);
    };

    getReserves();
  }, [fromToken.address, fromToken.decimals, getPairAddress, getReservesForPair, provider, toToken]);

  // Subscribe to changes in reserves for the selected pair.
  useEffect(() => {
    const listenForChanges = async () => {
      if (!pairAddress) return;

      const exchangeContract = new Contract(pairAddress, abis.pair, defaultProvider);

      exchangeContract.on('Sync', (res0, res1) => {
        const reserves0 = Number(formatUnits(res0));
        const reserves1 = Number(formatUnits(res1));

        setReserves({ reserves0, reserves1 });
      });
    };

    listenForChanges();
  }, [defaultProvider, pairAddress]);

  // Set prices whenever reserves change.
  useEffect(() => {
    if (!reserves) return;

    setPrices({
      fromToken: reserves?.reserves0 / reserves?.reserves1,
      toToken: reserves?.reserves1 / reserves?.reserves0,
    });
  }, [reserves]);

  // Check whether fromToken needs approval to transfer whenever it changes.
  useEffect(() => {
    if (!provider) return;

    if (fromToken.symbol === 'WETH') return;

    const checkIfApprovalNeeded = async () => {
      const remainingAllowance = await checkTokenAllowance(fromToken.address);

      if (remainingAllowance === 0) {
        setTokenIsApproved(false);
      }
    };

    checkIfApprovalNeeded();
  }, [checkTokenAllowance, fromToken.address, fromToken.symbol, provider]);

  const [isLoadingFromInput, setIsLoadingFromInput] = useState(false);
  const [isLoadingToInput, setIsLoadingToInput] = useState(false);

  // Debounced in order to prevent calls from being made after every single keystroke.
  const setToInputBasedOnFromInput = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!toToken) return;

        const { toAmount } = await getAmountsOut(value, [fromToken.address, toToken.address]);

        setIsLoadingToInput(false);

        setToInputValue(toAmount.toFixed(4));
      }, 300),
    [fromToken.address, getAmountsOut, toToken],
  );

  // Debounced in order to prevent calls from being made after every single keystroke.
  const setFromInputBasedOnToInput = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!toToken) return;

        const { fromAmount } = await getAmountsIn(value, [fromToken.address, toToken.address]);

        setIsLoadingFromInput(false);

        setFromInputValue(fromAmount.toFixed(4));
      }, 300),
    [fromToken.address, getAmountsIn, toToken],
  );

  // Using the provided token amount, calculate the approximate token amount for the opposite input.
  // This is done using onchain data in order to be as accurate as possible at the time of the input change.
  const handleInputChange = async (event: FormEvent) => {
    const target = event.target as HTMLInputElement;

    if (target.id === 'fromInput') {
      setFromInputValue(target.value);

      if (Number(target.value) > 0 && toToken) {
        setIsLoadingToInput(true);
        setToInputBasedOnFromInput(target.value);
      } else {
        setToInputValue('');
      }
    }

    if (target.id === 'toInput') {
      setToInputValue(target.value);

      if (Number(target.value) > 0 && toToken) {
        setIsLoadingFromInput(true);
        setFromInputBasedOnToInput(target.value);
      } else {
        setFromInputValue('');
      }
    }
  };

  const handleSwap = async () => {
    if (!provider) return;

    if (!toToken) return;

    if (!tokenIsApproved) {
      try {
        await approveTokenTransfer(fromToken.address);

        return setTokenIsApproved(true);
      } catch (exception: any) {
        console.log(exception);

        toast.error('Failed to approve token for transfer.');
      }
    }

    let swap: () => Promise<any>;

    if (fromToken.symbol === 'WETH') {
      swap = async () => swapExactETHForTokens(fromInputValue, fromToken, toToken);
    } else if (toToken.symbol === 'WETH') {
      swap = async () => swapExactTokensForETH(fromInputValue, fromToken, toToken);
    } else {
      swap = async () => swapExactTokensForTokens(fromInputValue, fromToken, toToken);
    }

    try {
      await swap();
    } catch (exception: any) {
      console.log(exception);

      if (exception.code === 'INSUFFICIENT_FUNDS') {
        toast.error('You have insufficient funds for this swap.');
      } else if (exception.code === 4001) {
        toast.info('Transaction cancelled.');
      } else {
        toast.error('Something went wrong with the swap you attempted.');
      }
    }
  };

  // Only allows WETH <> Token until token-to-token transfers are enabled.
  const getFilteredTokens = (oppositeToken?: Token) => {
    if (oppositeToken?.symbol === 'WETH') {
      return tokens.filter((token) => token.symbol !== 'WETH');
    }

    return tokens.filter((token) => token.symbol === 'WETH');
  };

  const onFlipButtonClick = () => {
    if (!toToken) return;

    setFromToken(toToken);
    setToToken(fromToken);
    setFromInputValue(toInputValue);
    setToInputValue(fromInputValue);
  };

  return (
    <Container>
      <TokenInput
        id="fromInput"
        isLoading={isLoadingFromInput}
        onInputChange={handleInputChange}
        onTokenSelect={setFromToken}
        selectedToken={fromToken}
        tokens={getFilteredTokens(toToken)}
        value={fromInputValue}
      />
      <FlipButton onClick={onFlipButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      </FlipButton>
      <TokenInput
        id="toInput"
        isLoading={isLoadingToInput}
        onInputChange={handleInputChange}
        onTokenSelect={setToToken}
        selectedToken={toToken}
        tokens={getFilteredTokens(fromToken)}
        value={toInputValue}
      />
      <SwapFooter fromToken={fromToken} prices={prices} toToken={toToken} loading={loadingReserves} />
      <SwapButton tokenIsApproved={tokenIsApproved} insufficientFunds={insufficientFunds} onSwap={handleSwap} />
    </Container>
  );
};
