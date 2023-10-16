import store from "@/store";
import { sanctionAbi } from "@/utils/abi/sanctionAbi";
import notification from "@/helpers/notification/notification.js";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";
import type { Address } from "@wagmi/core";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const checkSanctionAddress = async (address: Address | string) => {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const isSanctioned = await publicClient.readContract({
    address: SANCTIONS_LIST_ADDRESS,
    abi: sanctionAbi,
    functionName: "isSanctioned",
    args: [address],
  });

  if (isSanctioned) {
    await store.dispatch("notifications/new", notification.sanctionAddress);
  }

  return isSanctioned;
};
