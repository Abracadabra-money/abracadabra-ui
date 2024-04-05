import type { Address } from "viem";
import { multicall } from "@wagmi/core";
import { crvStakeConfig } from "@/configs/stake/crvConfig";
import type { CrvStakeInfo } from "@/types/crv/stakeInfo";

export const getCrvStakeInfo = async (
  chainId: number,
  account: Address,
  collateralAddress: Address
): Promise<CrvStakeInfo | Boolean> => {
  const config = crvStakeConfig[chainId as keyof typeof crvStakeConfig];
  if (!config) return false;

  const { mainToken, stakeToken, tokensRate }: any = config;
  if (collateralAddress) mainToken.contract.address = collateralAddress;

  const [userMainTokenBalance, userStakeTokenBalance, approvedAmount] =
    await multicall({
      contracts: [
        {
          ...mainToken.contract,
          functionName: "balanceOf",
          args: [account],
        },
        {
          ...stakeToken.contract,
          functionName: "balanceOf",
          args: [account],
        },
        {
          ...stakeToken.contract,
          functionName: "allowance",
          args: [account, mainToken.contract.address],
        },
      ],
    });

  return {
    tokensRate,
    mainToken: {
      ...mainToken,
      balance: userMainTokenBalance.result,
    },
    stakeToken: {
      ...stakeToken,
      balance: userStakeTokenBalance.result,
      approvedAmount: approvedAmount.result,
    },
  };
};
