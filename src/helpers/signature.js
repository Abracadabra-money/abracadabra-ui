import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { signTypedDataHelper } from "@/helpers/walletClienHelper.ts";

const signMasterContract = async (
  chainId,
  verifyingContract,
  user,
  masterContract,
  approved,
  nonce
) => {
  const domain = {
    name: "BentoBox V1",
    chainId: chainId,
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

  const warning = approved
    ? "Give FULL access to funds in (and approved to) BentoBox?"
    : "Revoke access to BentoBox?";

  // The data to sign
  const value = {
    warning,
    user,
    masterContract,
    approved,
    nonce: Number(nonce),
  };

  const signature = await signTypedDataHelper({
    domain,
    types,
    primaryType: "SetMasterContractApproval",
    message: value,
  });

  const publicClient = getPublicClient(chainId);

  const isVerified = await publicClient.verifyTypedData({
    address: user,
    domain,
    types,
    primaryType: "SetMasterContractApproval",
    message: value,
    signature,
  });

  if (!isVerified) throw new Error("Invalid signature");

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

export { parseSignature, signMasterContract };
