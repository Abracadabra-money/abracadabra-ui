import type { ContractInfo } from "@/types/global";
import type { Address } from "@wagmi/core";
import { BIPS, MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import type { MagicLvlTokensConfig } from "@/types/magicLvl/configsInfo";
import type { MagicLvlTokensInfo } from "@/types/magicLvl/stakeInfo";
import { useImage } from "@/helpers/useImage";

export const getTokensInfo = async (
  master: ContractInfo,
  harvestor: ContractInfo,
  { oracle, mainToken, stakeToken, pid, name }: MagicLvlTokensConfig,
  account: Address,
  publicClient: any
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
  ]: any = await publicClient.multicall({
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
      price: mainTokenPrice,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      rateIcon: useImage(`assets/images/stake/${name}-icon.svg`),
      decimals: stakeToken.decimals,
      contract: stakeToken.contract,
      walletBalance: userStakeTokenBalance.result,
      balance: stakeTokenBalance,
      pid: pid,
      price: stakeTokenPrice,
      approvedAmount: allowanceAmount.result,
    },
  };
};
