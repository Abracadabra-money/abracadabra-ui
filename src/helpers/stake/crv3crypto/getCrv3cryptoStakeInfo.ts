import { multicall, type Address } from "@wagmi/core";
import type { CrvStakeInfo } from "@/types/crv/stakeInfo";
import { crv3cryptoConfig } from "@/utils/stake/crv3cryptoConfig";

export const getCrv3cryptoStakeInfo = async (
  chainId: number,
  account: Address
): Promise<CrvStakeInfo | Boolean> => {
  const config = crv3cryptoConfig[chainId as keyof typeof crv3cryptoConfig];
  if (!config) return false;

  const { mainToken, stakeToken, tokensRate }: any = config;

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

  const test = {
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

  console.log(test);

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
