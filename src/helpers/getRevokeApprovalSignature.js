import { ethers } from "ethers";

const getApprovalEncode = async (
  signer,
  bentoContract,
  account,
  chain,
  masterContract
) => {
  const verifyingContract = bentoContract.address;
  const nonce = await bentoContract.nonces(account);
  const chainId = ethers.utils.hexlify(chain);

  const domain = {
    name: "BentoBox V1",
    chainId,
    verifyingContract,
  };

  // The named list of all type definitions
  const types = {
    SetMasterContractApproval: [
      { name: "warning", type: "string" },
      { name: "user", type: "address" },
      { name: "masterContract", type: "address" },
      { name: "approved", type: "bool" },
      { name: "nonce", type: "uint256" },
    ],
  };

  // The data to sign
  const value = {
    warning: "Revoke access to BentoBox?",
    user: account,
    masterContract,
    approved: false,
    nonce,
  };

  let signature;
  try {
    signature = await signer._signTypedData(domain, types, value);
  } catch (e) {
    console.log("SIG ERR:", e.code);

    if (e.code === -32603) {
      console.log("signature ERROR LEGER HERE", e.code);
      return "ledger";
    }
    return false;
  }

  const parsedSignature = parseSignature(signature);

  if (parsedSignature.v === 0) {
    parsedSignature.v = 27;
  }

  if (parsedSignature.v === 1) {
    parsedSignature.v = 28;
  }

  return parsedSignature;
};

const parseSignature = (signature) => {
  const parsedSignature = signature.substring(2);

  var r = parsedSignature.substring(0, 64);
  var s = parsedSignature.substring(64, 128);
  var v = parsedSignature.substring(128, 130);

  return {
    r: "0x" + r,
    s: "0x" + s,
    v: parseInt(v, 16),
  };
};

export { getApprovalEncode };
