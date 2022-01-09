import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  color: #282c34;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.md};
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;

  ${(props) => props.hidden && 'hidden'} :focus {
    border: none;
    outline: none;
  }
`;

type WalletButtonProps = {
  loadWeb3Modal?: () => Promise<void>;
  logoutOfWeb3Modal?: () => Promise<void>;
  provider?: Web3Provider;
};

export const WalletButton: FC<WalletButtonProps> = ({ loadWeb3Modal, logoutOfWeb3Modal, provider }) => {
  const [account, setAccount] = useState<string>();
  const [ethBalance, setEthBalance] = useState<string>();
  const [rendered, setRendered] = useState<string>();

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) return;

        // Load the user's accounts.
        const accounts = await provider.listAccounts();

        setAccount(accounts[0]);

        const balance = await provider.getBalance(accounts[0]);

        setEthBalance(Number(formatEther(balance)).toFixed(3));

        const network = await provider.getNetwork();

        // Set name to the first six and last four digits
        let displayName = `${account?.substring(0, 6)}...${account?.substring(38)}`;

        // ENS only works on mainnet.
        if (network.chainId === 1) {
          // Resolve the ENS name for the first account.
          const ensName = await provider.lookupAddress(accounts[0]);

          if (ensName) {
            displayName = ensName;
          }
        }

        setRendered(displayName);
      } catch (err) {
        setAccount('');
        setEthBalance('');
        setRendered('');
        console.error(err);
      }
    }

    fetchAccount();

    // Remove any existing accountsChanged listeners as there should only be one active.
    window.ethereum?.removeAllListeners('accountsChanged');

    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      console.log('fetching new account details');

      if (accounts.length === 0) return;

      // Update button text with the new account details.
      fetchAccount();
    });
  }, [account, provider]);

  const handleClick = () => {
    if (!provider) {
      loadWeb3Modal && loadWeb3Modal();
    } else {
      logoutOfWeb3Modal && logoutOfWeb3Modal();
    }
  };

  return <Button onClick={handleClick}>{rendered ? `${ethBalance} ETH - ${rendered}` : 'Connect Wallet'}</Button>;
};
