import store from "@/store";
import type { Address } from "@wagmi/core";
import { chainsList } from "@/helpers/chains";
import { createPublicClient, http } from "viem";
import { sanctionAbi } from "@/abis/sanctionAbi";
import notification from "@/helpers/notification/notification";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";

export const checkSanctionAddress = async (address: Address | string) => {
  const publicClient = createPublicClient({
    chain: chainsList[1],
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
