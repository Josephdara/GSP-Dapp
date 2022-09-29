import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Head from "next/head";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../constant";

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [wlSaleStarted, setWLSaleStarted] = useState(false);
  const [wlSaleEnded, setWlSaleEnded]= useState(false)
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();


  const checkWLSaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      const wLSaleEndtime = await nftContract.wlSaleEnded();
      const currentTime = Date.now()/1000
      const hasWlSaleEnded = wLSaleEndtime.lt(Math.floor(currentTime))
      setWlSaleEnded(hasWlSaleEnded)
    } catch (error) {
      console.error(error);
    }
  };

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const owner = await nftContract.owner();
      const userAddy = signer.getAddress();
      if (owner.toLowerCase() == userAddy.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startWLSale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await nftContract.startWLSale();
      await tx.wait();
      setWLSaleStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const checkWLSaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      const isWLSaleStarted = await nftContract.wlSaleStarted();
      setWLSaleStarted(isWLSaleStarted);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
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
      connectWallet()
      checkWLSaleStarted();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Glory Sound Prep NFT</title>
      </Head>
      <div className={styles.main}>
        {!walletConnected ? (
          <button onClick={connectWallet} className={styles.button}>
            {" "}
            Connect Wallet
          </button>
        ) : null}
      </div>
    </div>
  );
}
