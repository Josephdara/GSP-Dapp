import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, Contract, utils } from "ethers";
import Head from "next/head";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../constant";

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [wlSaleStarted, setWLSaleStarted] = useState(false);
  const [wlSaleEnded, setWlSaleEnded] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await nftContract.wLMint({
        value: utils.parseEther("0.01"),
      });
      await tx.wait();
      window.alert("Welcome to glory sound prep");
    } catch (error) {
      console.error(error);
    }
  };

  const wlMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const tx = await nftContract.wLMint({
        value: utils.parseEther("0.005"),
      });
      await tx.wait();
      window.alert("Welcome to glory sound prep");
    } catch (error) {
      console.error(error);
    }
  };

  const checkWLSaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      const wLSaleEndtime = await nftContract.wlSaleEnded();
      const currentTime = Date.now() / 1000;
      const hasWlSaleEnded = wLSaleEndtime.lt(Math.floor(currentTime));
      setWlSaleEnded(hasWlSaleEnded);
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
      if (owner.toLowerCase() == (await userAddy).toLowerCase()) {
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
      return isWLSaleStarted;
    } catch (error) {
      console.error(error);
      return false;
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
    return web3Provider;
  };
  const onPageLoad = async () => {
    await connectWallet();
    await getOwner();
    const wlSaleStarted = await checkWLSaleStarted();
    if (wlSaleStarted) {
      await checkWLSaleEnded();
    }
  };
  function renderBody() {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}></button>
      );
    }
    if (loading) {
      return <span className={styles.description}>Loading.....</span>;
    }
    if (isOwner && !wlSaleStarted) {
      return (
        <button onClick={startWLSale} className={styles.button}>
          {" "}
          Start PreSale
        </button>
      );
    }
    if (!wlSaleStarted) {
      return (
        <div>
          <span className={styles.description}>
            WhiteList Mint is yet To start
          </span>
        </div>
      );
    }
    if (wlSaleStarted && !wlSaleEnded) {
      return (
        <div>
          <span className={styles.description}>
            WhiteList Mint has Started, You can begin minting if you are
            whitelisted
          </span>
          <button className={styles.button} onClick={wlMint}>
            WhiteList Mint
          </button>
        </div>
      );
    }
    if (wlSaleEnded) {
      return (
        <div>
          <span className={styles.description}>
            WhiteList Mint has Ended, You can mint during the public Sale
          </span>
          <button className={styles.button} onClick={publicMint}>
            WhiteList Mint
          </button>
        </div>
      );
    }
  }
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Glory Sound Prep NFT</title>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Glory Sound Prep Collection</h1>
          <span className={styles.description}>Mint your glory sound prep NFT</span>
        </div>
        {renderBody()}
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by josephdara.eth
      </footer>
    </div>
  );
}
