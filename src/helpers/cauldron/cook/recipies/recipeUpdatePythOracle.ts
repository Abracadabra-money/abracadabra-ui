import { actions } from "@/helpers/cauldron/cook/actions";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import type { CookData } from "@/helpers/cauldron/cook/cooks/types";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { type PublicClient, encodeFunctionData } from "viem";
import { getPythFeedData } from "@/helpers/pyth";
import pythAbi from "@/abis/pyth";
import { getPythAddress } from "../../getPythAddress";

const recipeUpdatePythOracle = async (
  cookData: CookData,
  cauldronObject: CauldronInfo,
): Promise<{ cookData: CookData, value: bigint }> => {
  const pythAddress = getPythAddress(cauldronObject.config.chainId);
  const { feedIds } = cauldronObject.config.cauldronSettings.oracleInfo!;

  const publicClient = getPublicClient(cauldronObject.config.chainId) as PublicClient;

  const pythData = await getPythFeedData(feedIds);

  const updateFee = await publicClient.readContract({
    abi: pythAbi,
    address: pythAddress,
    functionName: "getUpdateFee",
    args: [pythData.binary.data],
  });
  const callData = encodeFunctionData({
    abi: pythAbi,
    functionName: "updatePriceFeeds",
    args: [pythData.binary.data],
  });

  cookData = await actions.call(cookData, pythAddress, callData, false, false, 0, updateFee);

  return { cookData, value: updateFee };
};

export default recipeUpdatePythOracle;
