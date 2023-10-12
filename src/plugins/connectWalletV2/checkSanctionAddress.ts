import store from "@/store";
import { readContract } from "@wagmi/core";
import { sanctionAbi } from "@/utils/abi/sanctionAbi";
import notification from "@/helpers/notification/notification.js";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";
import type { Address } from "@wagmi/core";

export const checkSanctionAddress = async (address: Address | string) => {
  const isSanctioned = await readContract({
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
