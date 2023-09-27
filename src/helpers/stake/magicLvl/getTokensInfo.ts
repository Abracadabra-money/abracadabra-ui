import type { ContractInfo } from "@/types/global";
import { multicall, type Address } from "@wagmi/core";
import { BIPS, MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import type { MagicLvlTokensConfig } from "@/types/magicLvl/configsInfo";
import type { MagicLvlTokensInfo } from "@/types/magicLvl/stakeInfo";

export const getTokensInfo = async (
  master: ContractInfo,
  harvestor: ContractInfo,
  { oracle, mainToken, stakeToken, pid, name }: MagicLvlTokensConfig,
  account: Address
): Promise<MagicLvlTokensInfo> => {
  const [
    oracleRate,
    tokenRate,
    totalSupply,
    mainTokenBalance,
    userStakeTokenBalance,
    levelMasterBalance,
    allowanceAmount,
    feeBips,
  ]: any = await multicall({
    contracts: [
      {
        ...oracle,
        functionName: "peekSpot",
        args: ["0x"],
      },
      {
        ...mainToken.contract,
        functionName: "convertToAssets",
        args: [ONE_ETHER_VIEM],
      },
      {
        ...mainToken.contract,
        functionName: "totalSupply",
        args: [],
      },
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
        ...master,
        functionName: "userInfo",
        args: [pid, account],
      },
      {
        ...stakeToken.contract,
        functionName: "allowance",
        args: [account, mainToken.contract.address],
      },
      {
        ...harvestor,
        functionName: "feeBips",
        args: [],
      },
    ],
  });

  const [userMasterAmount] = levelMasterBalance.result;
  const stakeTokenPrice = (MIM_PRICE * ONE_ETHER_VIEM) / oracleRate.result;
  const mainTokenPrice = (stakeTokenPrice * tokenRate.result) / ONE_ETHER_VIEM;
  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;
  const stakeTokenBalance = userStakeTokenBalance.result + userMasterAmount;

  return {
    name: name,
    tokensRate: tokenRate.result,
    feePercent: feeBips.result / BIPS,
    levelMasterContract: master,
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      decimals: mainToken.decimals,
      contract: mainToken.contract,
      balance: mainTokenBalance.result,
      totalSupplyUsd: totalSupplyUsd,
      approvedAmount: allowanceAmount.result,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      decimals: stakeToken.decimals,
      contract: stakeToken.contract,
      walletBalance: userStakeTokenBalance.result,
      balance: stakeTokenBalance,
      pid: pid,
    },
  };
};
