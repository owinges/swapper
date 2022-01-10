import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { LoadingSpinner, TokenDropdown } from '..';
import { abis } from '../../contracts';
import { Token, tokens } from '../TokenDropdown/tokenList';
import { getPriceOfCoins } from '../../services/coinGeckoService';

const toCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format;

const InputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.grayLight};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0 1rem;
  margin-bottom: 8px;
  max-width: 100%;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.grayDark};
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;

  input {
    background-color: transparent;
    border: none;
    flex: 1 1 auto;
    font-size: ${({ theme }) => theme.fontSize.xxl};
    outline: none;
    width: 0;
  }

  span {
    color: ${({ theme }) => theme.colors.grayDarker};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

type TokenInputProps = {
  id: string;
  isLoading: boolean;
  onInputChange: (event: FormEvent<HTMLInputElement>) => void;
  onTokenSelect: (token: Token) => void;
  provider?: Web3Provider;
  selectedToken?: Token;
  value: string;
};

export const TokenInput: FC<TokenInputProps> = ({ id, isLoading, onInputChange, onTokenSelect, provider, selectedToken, value }) => {
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const { data: coin, isFetching } = useQuery(selectedToken!.address, () =>
    getPriceOfCoins([selectedToken!.coingeckoId]).then((res) => res.data),
  );

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider || !selectedToken) return;

        let balance: BigNumber;

        const accounts = await provider.listAccounts();

        // Get ETH balance if token is WETH.
        if (selectedToken.symbol === 'WETH') {
          balance = await provider.getBalance(accounts[0]);
        } else {
          const tokenContract = new Contract(selectedToken?.address, abis.erc20, provider);

          balance = await tokenContract.balanceOf(accounts[0]);
        }

        const balanceAsNumber = Number(formatUnits(balance));

        // Only show four decimal places if the balance is greater than 0.
        setTokenBalance(balanceAsNumber ? balanceAsNumber.toFixed(4) : '0');
      } catch (err) {
        setTokenBalance('');
        console.error(err);
      }
    }

    fetchAccount();
  }, [coin, provider, selectedToken]);

  const getPrice = () => {
    if (!selectedToken || !coin || !coin[selectedToken.coingeckoId]) return;

    const valueByCurrency = coin[selectedToken.coingeckoId].usd * Number(value);

    return coin ? toCurrency(valueByCurrency) : 'Unknown price';
  };

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.includes(' ') || value.includes('..')) return;

    const isNumber = !isNaN(Number(value));

    if (isNumber || value === '' || value === '.') {
      onInputChange(event);
    }
  };

  return (
    <InputContainer>
      <Row>
        {isLoading ? (
          <div style={{ flex: 1 }}>
            <LoadingSpinner size="md" style={{ position: 'absolute' }} />
          </div>
        ) : (
          <input id={id} type="text" placeholder="0.0" value={value} onChange={handleInputChange} />
        )}
        <TokenDropdown onSelect={onTokenSelect} selectedToken={selectedToken} tokens={tokens} disabled={id === 'fromInput'} />
      </Row>
      <Row>
        <span>{isFetching ? <LoadingSpinner style={{ position: 'absolute' }} /> : `~${getPrice()}`}</span>
        <span>Balance: {tokenBalance}</span>
      </Row>
    </InputContainer>
  );
};
