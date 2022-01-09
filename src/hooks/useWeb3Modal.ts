import { Web3Provider } from '@ethersproject/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Web3Modal from 'web3modal';

function useWeb3Modal(): [Web3Provider | undefined, () => Promise<void>, () => Promise<void>] {
  const [provider, setProvider] = useState<Web3Provider>();
  const [autoLoaded, setAutoLoaded] = useState(false);

  // TODO: Add support for WalletConnect.
  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
  }, []);

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();

    setProvider(new Web3Provider(newProvider));
  }, [web3Modal]);

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

  return [provider, loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
