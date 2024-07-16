import { getDegenBoxHelperAddress } from "@/helpers/cauldron/cook/degenBoxHelper/getDegenBoxHelperContract.js";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import { getAccountHelper } from "@/helpers/walletClienHelper";

const checkAndSetMcApprove = async (cookData, cauldronObject, mcApproved) => {
  const { bentoBox, cauldron } = cauldronObject.contracts;
  const { address: userAddres } = getAccountHelper();

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const degenBoxHelperAddress = getDegenBoxHelperAddress(
    cauldronObject.config.chainId
  );

  const isApproved = useDegenBoxHelper
    ? await bentoBox.masterContractApproved(degenBoxHelperAddress, userAddres)
    : mcApproved;

  const masterContract = useDegenBoxHelper
    ? degenBoxHelperAddress
    : await cauldron.masterContract();

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
