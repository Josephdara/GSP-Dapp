import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Head from "next/head";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async () => {
    await getProviderOrSigner();
    setWalletConnected(true);
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Switch to Goerli Noww");
      throw new Error("Incorrect Network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Glory Sound Prep NFT</title>
      </Head>
      <div className={styles.main}>
        {!walletConnected ? (
          <button onClick={connectWallet} className={styles.button}> Connect Wallet</button>
        ) : null}
      </div>
    </div>
  );
}
