import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  outline: none;
  padding: 16px;
  transition: ${({ theme }) => theme.transition};
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.boxShadow.primary};
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDarker};
    box-shadow: ${({ theme }) => theme.boxShadow.primaryDarker};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayLight};
    color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

type SwapButtonProps = {
  insufficientFunds?: boolean;
  loadWeb3Modal?: () => Promise<void>;
  onSwap?: () => Promise<void>;
  provider?: Web3Provider;
  tokenIsApproved: boolean;
};

export const SwapButton: FC<SwapButtonProps> = ({ insufficientFunds = false, loadWeb3Modal, onSwap, provider, tokenIsApproved }) => {
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) return;

        const accounts = await provider.listAccounts();

        setAccount(accounts[0]);
      } catch (err) {
        setAccount('');
        console.error(err);
      }
    }

    fetchAccount();
  }, [account, provider, setAccount]);

  const handleClick = () => {
    if (!provider) {
      loadWeb3Modal && loadWeb3Modal();
    } else {
      onSwap && onSwap();
    }
  };

  const getButtonText = () => {
    if (!account) return 'Connect Wallet';

    if (insufficientFunds) return 'Insufficient funds';

    if (!tokenIsApproved) return 'Approve';

    return 'Swap';
  };

  return (
    <Button disabled={insufficientFunds} onClick={handleClick}>
      {getButtonText()}
    </Button>
  );
};
