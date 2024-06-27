import { hexToNumber, slice, type Address } from "viem";

import { getWalletClientHelper } from "@/helpers/walletClienHelper";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import {
  MAGIC_LP_ADDRESS,
  BLAST_BRIDGE_ADDRESS,
} from "@/constants/blastLpMigration";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";

export const setPermit = async (
  user: Address,
  value: bigint,
  deadline: bigint,
  chainId: number = 81457
) => {
  try {
    const publicClient = getPublicClient(chainId);
    const walletClient = await getWalletClientHelper();

    const nonce = await publicClient.readContract({
      address: MAGIC_LP_ADDRESS,
      abi: BlastMagicLpAbi,
      functionName: "nonces",
      args: [user],
    });

    const erc20Name = "MagicLP MIM/USDB";
    const permitVersion = "1";

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const domainData = {
      name: erc20Name,
      /** We assume 1 if permit version is not specified */
      version: permitVersion ?? "1",
      chainId: chainId,
      verifyingContract: MAGIC_LP_ADDRESS,
    };

    const message = {
      owner: user,
      spender: BLAST_BRIDGE_ADDRESS,
      value,
      nonce,
      deadline,
    };

    const signature = await walletClient!.signTypedData({
      account: user,
      message,
      domain: domainData,
      primaryType: "Permit",
      types,
    });

    const [r, s, v] = [
      slice(signature, 0, 32),
      slice(signature, 32, 64),
      slice(signature, 64, 65),
    ];
    return { r, s, v: hexToNumber(v) };
  } catch (error) {
    console.log("setPermit error:", error);
  }
};
