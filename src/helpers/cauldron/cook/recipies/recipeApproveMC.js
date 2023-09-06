import { signMasterContract } from "@/helpers/signature";
import { actions } from "@/helpers/cauldron/cook/actions";

const signAndGetData = async (
  cookData,
  cauldronObject,
  masterContract,
  approved = true,
  addNonce = 0
) => {
  const user = this.account; // TODO
  const { cauldron, bentoBox } = cauldronObject.contracts;
  const verifyingContract = await cauldron.bentoBox();
  const nonce = await bentoBox.nonces(user);

  const parsedSignature = await signMasterContract(
    this.signer, // TODO
    cauldronObject.config.chainId,
    verifyingContract,
    user,
    masterContract,
    approved,
    +nonce + addNonce
  );

  cookData = actions.bentoSetApproval(
    cookData,
    user,
    masterContract,
    approved,
    parsedSignature.v,
    parsedSignature.r,
    parsedSignature.s
  );

  return cookData;
};

const recipeApproveMC = async (
  cookData,
  cauldronObject,
  approved = true,
  masterContract
) => {
  const addNonce = cookData.events.filter((value) => value === 24).length;

  cookData = await signAndGetData(
    cookData,
    cauldronObject,
    masterContract,
    approved,
    addNonce
  );

  return cookData;
};

export default recipeApproveMC;
