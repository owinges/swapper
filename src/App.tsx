import React, { useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import styled from '@emotion/styled';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Swap, WalletButton } from './components';
import logo from './ethereumLogo.png';
import useWeb3Modal from './hooks/useWeb3Modal';

const Main = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: 70px;
`;

const Image = styled.img`
  height: 30vmin;
  margin-bottom: 16px;
`;

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  useEffect(() => {
    if (!provider) return;

    const prov = new Web3Provider(window.ethereum, 'any');

    prov?.on('network', (newNetwork, oldNetwork) => {
      // If the user isn't connected to Ethereum mainnet, show an error and request that MetaMask prompts the user to switch.
      if (newNetwork.chainId !== 1) {
        // TODO: Instead of showing a toast, change this to a modal that blocks the user from doing anything.
        toast.error('You must connect to Ethereum mainnet to use this app!');

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
  }, [provider]);

  return (
    <>
      <Header>
        <WalletButton loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} provider={provider} />
      </Header>
      <Main>
        <Image src={logo} alt="ethereum-logo" />
        <Swap loadWeb3Modal={loadWeb3Modal} provider={provider} />
      </Main>
      <ToastContainer theme="colored" />
    </>
  );
}

export default App;
