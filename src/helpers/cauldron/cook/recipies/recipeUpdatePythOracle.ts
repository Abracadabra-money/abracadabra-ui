import { actions } from "@/helpers/cauldron/cook/actions";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import type { CookData } from "@/helpers/cauldron/cook/cooks/types";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { parseAbi, type PublicClient, encodeFunctionData } from "viem";
import { getPythFeedData } from "@/helpers/pyth";

const pythAbi = parseAbi([
  "function getUpdateFee( bytes[] calldata updateData ) public view returns (uint feeAmount)",
  "function updatePriceFeeds(bytes[] calldata updateData) external payable",
]);

const recipeUpdatePythOracle = async (
  cookData: CookData,
  cauldronObject: CauldronInfo,
): Promise<{ cookData: CookData, value: bigint }> => {
  const { address: oracleAddress, feedId } = cauldronObject.config.cauldronSettings.oracleInfo!;

  const publicClient = getPublicClient(cauldronObject.config.chainId) as PublicClient;

  const pythData = await getPythFeedData([feedId]);

  const updateFee = await publicClient.readContract({
    abi: pythAbi,
    address: oracleAddress,
    functionName: "getUpdateFee",
    args: [pythData.binary.data],
  })
  const callData = encodeFunctionData({
    abi: pythAbi,
    functionName: "updatePriceFeeds",
    args: [pythData.binary.data],
  })

  cookData = await actions.call(cookData, oracleAddress, callData, false, false, 0, updateFee);

  return { cookData, value: updateFee };
};

export default recipeUpdatePythOracle;
