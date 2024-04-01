import { readContract } from "@wagmi/core";
import { getPublicClient } from "@/helpers/getPublicClient";
const abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "pricePerShare",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "withdraw",
    inputs: [{ name: "maxShares", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];

const vaultContract = {
  address: "0xa258C4606Ca8206D8aA700cE2143D7db854D168c", // WETH yVault (yvWETH)
  abi,
};

export const getYearnVaultWithdrawAmount = async (
  collateralAmount,
  account
) => {
  try {
    const publicClient = getPublicClient(1);

    const simulateResult = await publicClient.simulateContract({
      address: vaultContract.address,
      abi: vaultContract.abi,
      functionName: "withdraw",
      args: [collateralAmount],
      account: account,
    });

    console.log(
      "getYearnVaultWithdrawAmount simulateResult: ",
      simulateResult.result
    );

    return simulateResult.result;
  } catch (error) {
    console.log("getYearnVaultWithdrawAmount error: ", error);

    const pricePerShare = await readContract({
      address: vaultContract.address,
      abi: vaultContract.abi,
      functionName: "pricePerShare",
      args: [],
    });

    const resultByPrice =
      (collateralAmount * pricePerShare) / 10000000000000000000n;

    return resultByPrice;
  }
};
