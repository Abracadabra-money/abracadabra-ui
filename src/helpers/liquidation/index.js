import { Contract } from "ethers";
import { LIQUIDATION_HELPER } from "./constants";
import helperAbi from "./abi/liquidationHelper";
import { markRaw } from "vue";
export const getLiquidationHelperContract = (signer) => {
  return markRaw(new Contract(LIQUIDATION_HELPER, helperAbi, signer));
};

export const liquidate = async (
  contract,
  cauldron,
  account,
  borrowPart,
  cauldronVersion
) => {
  const estimateGas = await contract.estimateGas.liquidate(
    cauldron,
    account,
    borrowPart,
    cauldronVersion
  );

  const gasLimit = estimateGas.add(estimateGas.div(100).mul(5)); // add 5% to estimateGas result

  const tx = await contract.liquidate(
    cauldron,
    account,
    borrowPart,
    cauldronVersion,
    { gasLimit }
  );

  return await tx.wait();
};

export const liquidateMax = async (
  contract,
  cauldron,
  account,
  cauldronVersion
) => {
  const estimateGas = await contract.estimateGas.liquidateMax(
    cauldron,
    account,
    cauldronVersion
  );

  const gasLimit = estimateGas.add(estimateGas.div(100).mul(5)); // add 5% to estimateGas result

  const tx = await contract.liquidateMax(cauldron, account, cauldronVersion, {
    gasLimit,
  });

  return await tx.wait();
};
