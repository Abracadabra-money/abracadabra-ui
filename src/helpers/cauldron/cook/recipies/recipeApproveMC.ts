import { signMasterContract } from "@/helpers/signature";
import { actions } from "@/helpers/cauldron/cook/actions";
import { setMasterContractApproval } from "@/helpers/cauldron/boxes";

const signAndGetData = async (
  cookData: any,
  cauldronObject: any,
  masterContract: string,
  approved: boolean = true,
  addNonce: number = 0,
  user: string
): Promise<any> => {
  const { cauldron, bentoBox } = cauldronObject.contracts;
  const verifyingContract = await cauldron.bentoBox();
  const nonce = await bentoBox.nonces(user);
  
  try {
    const parsedSignature: any = await signMasterContract(
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
  } catch (error) {
    console.log("Signature error:", error)
    const approvalMaster = await setMasterContractApproval(
      bentoBox,
      user,
      masterContract,
      approved
    );

    if (!approvalMaster) return false; // TODO: update catch
    return cookData;
  }
};

const recipeApproveMC = async (
  cookData: any,
  cauldronObject: any,
  approved: boolean = true,
  masterContract: string,
  user: string
): Promise<any> => {
  const addNonce = cookData.events.filter(
    (value: number) => value === 24
  ).length;

  cookData = await signAndGetData(
    cookData,
    cauldronObject,
    masterContract,
    approved,
    addNonce,
    user
  );

  return cookData;
};

export default recipeApproveMC;
