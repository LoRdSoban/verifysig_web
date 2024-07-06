import React, { useEffect, useState } from "react";
import { useConnect } from "@stacks/connect-react";
import { StacksTestnet, StacksDevnet} from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  makeRandomPrivKey,
  getPublicKey,
  createStacksPrivateKey,
  compressPublicKey,
  serializeCV,
  signWithKey,
  stringAsciiCV,
  tupleCV,
  uintCV,
  principalCV,
  bufferCV,
} from "@stacks/transactions";
import { userSession } from "./ConnectWallet";
import {createHash} from "crypto";
import {hex} from "@scure/base"

const ContractCallVerifySig = () => {
  const { doContractCall } = useConnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
  }, []);

  const privateKey = 'd55c47953b34161786b1c0351fbf226658635c7a25bd5fcc304098c3d0f307c5';

  // function generateKey() {
    
  //   const publicKey = getPublicKey(privateKey);
  //   const compressedPublicKey = compressPublicKey(publicKey["data"]);
  //   console.log("Private Key:", privateKey);
  //   console.log("Public Key:", publicKey);
  //   console.log("Private Key (hex):", hex.encode(privateKey["data"]));
  //   console.log("Public Key (hex):", hex.encode(publicKey["data"]));
  //   console.log("Compressed Public Key (hex):", hex.encode(compressedPublicKey["data"]));
  // }

  function sha256(data){
    return createHash('sha256').update(data).digest();
  }
  
  function structuredDataHash(structuredData) {
    return sha256(serializeCV(structuredData));
  }

  function makeStructuredData(proposalName) {
    return tupleCV({
      proposalId: uintCV(proposalName),
      sender: principalCV(userSession.loadUserData().profile.stxAddress.testnet),
    });
  }

  function vrsToRsv(sig) {
    return hex.decode(sig.slice(2) + sig.slice(0, 2));
  }
  
  function sign(_hash, privateKey) {
    const hash = typeof _hash === 'string' ? _hash : hex.encode(_hash);
    const key = createStacksPrivateKey(privateKey);
    const data = signWithKey(key, hash).data;
    return vrsToRsv(data);
  }

  function verify() {
    const proposalId =  12;
    const structuredData = makeStructuredData(proposalId);
    const hash = structuredDataHash(structuredData);
    const sig = sign(hash, privateKey);

    console.log("Signature:", sig);

    doContractCall({
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      contractAddress: "ST3B5YKP344KCZ5Q8VKA5PNRF3X546PMP80EMWC10",
      contractName: "verify-sig-v1",
      functionName: "verify-sig",
      functionArgs: [uintCV(proposalId), bufferCV(sig)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
        window
          .open(
            `https://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
            "_blank"
          )
          .focus();
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
    
  }

  if (!mounted || !userSession.isUserSignedIn()) {
    return null;
  }

  return (
    <>
    <div>
      <h3>Verify Signature</h3>
      <button className="Vote" onClick={verify}>
        Verify
      </button>
    </div>
    </>
  );
};

export default ContractCallVerifySig;
