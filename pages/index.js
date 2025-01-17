import Head from "next/head";
import Image from "next/image";
import ConnectWallet from "../components/ConnectWallet";
import ContractCallVerifySig from "../components/ContractCallVerifySig";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Verify Signature</h1>

        <div className={styles.components}>
          {/* ConnectWallet file: `../components/ConnectWallet.js` */}
          <ConnectWallet />
          {/* ContractCallVote file: `../components/ContractCallVote.js` */}
          <ContractCallVerifySig />
        </div>
      </main>
    </div>
  );
}
