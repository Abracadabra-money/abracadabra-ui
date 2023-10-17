import { getDegenBoxHelperAddress } from "@/helpers/cauldron/cook/degenBoxHelper/getDegenBoxHelperContract.js";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";
import { getAccount } from '@wagmi/core'


const checkAndSetMcApprove = async (cookData, cauldronObject, mcApproved) => {
  const { bentoBox, cauldron } = cauldronObject.contracts;
  const { address: userAddres } = getAccount()

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const degenBoxHelperAddress = getDegenBoxHelperAddress(
    cauldronObject.chainId
  );

  const isApproved = useDegenBoxHelper
    ? await bentoBox.masterContractApproved(
        degenBoxHelperAddress,
        userAddres
      )
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
