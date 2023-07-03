import type { Contract } from "ethers";

const APPROVE_AMOUNT: string =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const APPROVE_GAS_LIMIT: number = 1000;

export const approveToken = async (
  contract: Contract,
  spender: string
): Promise<Boolean> => {
  try {
    const estimateGas = await contract.estimateGas.approve(
      spender,
      APPROVE_AMOUNT
    );

    const gasLimit = APPROVE_GAS_LIMIT + +estimateGas.toString();

    const tx = await contract.approve(spender, APPROVE_AMOUNT, {
      gasLimit,
    });

    await tx.wait();
    return true;
  } catch (error) {
    console.log("Approve Token:", error);
    return false;
  }
};
