import { getDegenBoxHelperAddress } from "@/helpers/cauldron/cook/degenBoxHelper/getDegenBoxHelperContract.js";
import recipeApproveMC from "@/helpers/cauldron/cook/recipies/recipeApproveMC";

const checkAndSetMcApprove = async (cookData, cauldronObject, mcApproved) => {
  const { bentoBox, cauldron } = cauldronObject.contracts;

  const useDegenBoxHelper =
    cauldronObject.config.cauldronSettings.useDegenBoxHelper;

  const degenBoxHelperAddress = getDegenBoxHelperAddress(
    cauldronObject.chainId
  );

  const isApproved = useDegenBoxHelper
    ? await bentoBox.masterContractApproved(
        degenBoxHelperAddress,
        this.account // TODO
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
      masterContract
    );
  }

  return cookData;
};

export default checkAndSetMcApprove;
