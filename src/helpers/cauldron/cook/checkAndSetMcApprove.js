import bentoBoxAbi from "@/abis/bentoBox";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import { getDegenBoxHelperAddress } from "@/helpers/cauldron/cook/degenBoxHelper/getDegenBoxHelperContract.js";

const checkAndSetMcApprove = async (cookData, cauldronObject, mcApproved) => {
  const { address: userAddres } = getAccountHelper();

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const degenBoxHelperAddress = getDegenBoxHelperAddress(
    cauldronObject.config.chainId
  );

  const publicClient = getPublicClient(cauldronObject.config.chainId);

  const bentoBoxAddress = await publicClient.readContract({
    address: cauldronObject.config.contract.address,
    abi: cauldronObject.config.contract.abi,
    functionName: "bentoBox",
    args: [],
  });

  const isApproved = useDegenBoxHelper
    ? await publicClient.readContract({
        address: bentoBoxAddress,
        abi: bentoBoxAbi,
        functionName: "masterContractApproved",
        args: [degenBoxHelperAddress, userAddres],
      })
    : mcApproved;

  const masterContract = useDegenBoxHelper
    ? degenBoxHelperAddress
    : await publicClient.readContract({
        address: cauldronObject.config.contract.address,
        abi: cauldronObject.config.contract.abi,
        functionName: "masterContract",
        args: [],
      });

  if (!isApproved) {
    cookData = await recipeApproveMC(
      cookData,
      cauldronObject,
      true,
      masterContract,
      userAddres
    );
  }

  return cookData;
};

export default checkAndSetMcApprove;
