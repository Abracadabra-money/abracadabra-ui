import { Contract } from "ethers";

import MasterContractOwnerAbi from "@/utils/abi/MasterContractOwner";
const MasterContractOwner = "0x16ebACab63581e69d6F7594C9Eb1a05dF808ea75";

export const getReduceSupplyData = async (cauldron, provider) => {
  try {
    const MasterContractOwnerContract = new Contract(
      MasterContractOwner,
      JSON.stringify(MasterContractOwnerAbi),
      provider
    );

    const reduceCompletelyTx =
      await MasterContractOwnerContract.populateTransaction.reduceCompletely(
        cauldron
      );

    return reduceCompletelyTx.data;
  } catch (e) {
    console.log("getReduceSupplyData error:", e);
  }
};
