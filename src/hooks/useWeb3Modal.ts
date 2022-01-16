import { useCallback, useEffect, useMemo, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import { useUniswap } from '../context/UniswapContext';

function useWeb3Modal(): [() => Promise<void>, () => Promise<void>] {
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { setProvider } = useUniswap();

  // TODO: Add support for WalletConnect.
  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      cacheProvider: true,
    });
  }, []);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();

    setProvider(new Web3Provider(newProvider));
  }, [setProvider, web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If the wallet has been loaded before, load it automatically now.
  useEffect(() => {
    if (!autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
