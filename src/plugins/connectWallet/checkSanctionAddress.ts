import store from "@/store";
import type { Address } from "@wagmi/core";
import { sanctionAbi } from "@/abis/sanctionAbi";
import notification from "@/helpers/notification/notification";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const checkSanctionAddress = async (address: Address | string) => {
  const publicClient = getPublicClient(1);

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
