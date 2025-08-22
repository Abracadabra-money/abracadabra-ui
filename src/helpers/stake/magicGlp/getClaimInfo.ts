import { ethers } from "ethers";
import { formatUnits } from "viem";
import type { Address } from "viem";
// @ts-ignore
import oracleAbi from "@/abis/oracle.js";
// @ts-ignore
import tokensAbi from "@/abis/tokensAbi/index";
import { useImage } from "@/helpers/useImage";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import {
  formatPercent,
  formatTokenBalance,
  formatUSD,
} from "@/helpers/filters";

export type ClaimInfo = {
  mainToken: {
    name: string;
    decimals: number;
    address: Address;
    abi: any;
    cauldron: Address;
    price: bigint;
    balance: bigint;
    parsedBalance: string;
    balanceUsd: string;
  };
  rewards: {
    name: string;
    decimals: number;
    icon: string;
    cauldron: Address;
    address: Address;
    price: number;
    claimAmount: string;
    claimAmountUsd: string;
    rewardAmountUsd: string;
    percent: string;
  }[];
};

type Reward = {
  name: string;
  decimals: number;
  icon: string;
  cauldron: Address | string;
  address: Address | string;
  oracle: Address | string;
};

const config = {
  mainToken: {
    name: "magicGLP",
    decimals: 18,
    address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
    abi: tokensAbi.magicGLP,
    cauldron: "0x726413d7402fF180609d0EBc79506df8633701B1",
  },
  rewards: [
    {
      name: "gmETH",
      decimals: 18,
      icon: useImage("assets/images/tokens/GM_ETH.png"),
      address: "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336",
      cauldron: "0x2b02bBeAb8eCAb792d3F4DDA7a76f63Aa21934FA",
      oracle: "0x139A6512edC90a140BC6f042c920f87C2790A6EF",
    },
    {
      name: "GLP",
      decimals: 18,
      icon: useImage("assets/images/tokens/GLP.png"),
      address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
      cauldron: "0x5698135CA439f21a57bDdbe8b582C62f090406D5",
      oracle: "0xBFc0C2ec046cE4f0e8778afF3A0de159d921b3C2",
    },
  ],
};

export const getClaimInfo = async (chainId: number, account: Address) => {
  const publicClient = getPublicClient(chainId);

  if (!account) return getEmptyClaimInfo();

  const userMagicGlpBalance = await publicClient.readContract({
    address: config.mainToken.address,
    abi: config.mainToken.abi,
    functionName: "balanceOf",
    args: [account],
  });

  if (!userMagicGlpBalance) return getEmptyClaimInfo();

  const claimPreview = await publicClient.readContract({
    address: config.mainToken.address,
    abi: config.mainToken.abi,
    functionName: "previewClaim",
    args: [userMagicGlpBalance],
  });

  const parsedBalance = Number(
    formatUnits(userMagicGlpBalance, config.mainToken.decimals)
  );

  const { rewards, mainTokenAmountUsd } = await getRewardsInfo(
    publicClient,
    config.rewards,
    claimPreview
  );

  return {
    mainToken: {
      ...config.mainToken,
      balance: userMagicGlpBalance,
      parsedBalance: formatTokenBalance(parsedBalance),
      balanceUsd: formatUSD(mainTokenAmountUsd),
    },
    rewards,
  };
};

const getEmptyClaimInfo = () => {
  return {
    mainToken: {
      ...config.mainToken,
      balance: 0n,
      parsedBalance: formatTokenBalance(0),
      balanceUsd: formatUSD(0),
    },

    rewards: config.rewards.map((reward) => {
      return {
        ...reward,
        claimAmount: formatTokenBalance(0),
        claimAmountUsd: formatUSD(0),
      };
    }),
  };
};

const getRewardsTokenRate = async (publicClient: any, rewards: Reward[]) => {
  const rewardsPrice = await publicClient.multicall({
    contracts: rewards.map((reward) => {
      return {
        address: reward.oracle,
        abi: oracleAbi,
        functionName: "peekSpot",
        args: ["0x"],
      };
    }),
  });

  return rewardsPrice.map((item: any) => item.result);
};

const getRewardsInfo = async (
  publicClient: any,
  rewards: Reward[],
  claimPreview: any
) => {
  const rewardsRate = await getRewardsTokenRate(publicClient, config.rewards);

  const rewardsInfo = rewards.map((reward, index) => {
    const previewItem = claimPreview.find(
      (item: any) => item.token === reward.address
    );

    const claimAmount = previewItem?.amount || 0n;
    const claimAmountUsd = (claimAmount * 10n ** 18n) / rewardsRate[index];

    return {
      ...reward,
      rewardAmountUsd: claimAmountUsd,
      claimAmount: formatTokenBalance(formatUnits(claimAmount, 18)),
      claimAmountUsd: formatUSD(formatUnits(claimAmountUsd, 18)),
    };
  });

  const totalUsd = Number(
    formatUnits(
      rewardsInfo.reduce((acc, r) => acc + r.rewardAmountUsd, 0n),
      18
    )
  );

  return {
    rewards: rewardsInfo.map((reward) => ({
      ...reward,
      percent: formatPercent(
        (Number(formatUnits(reward.rewardAmountUsd, 18)) / totalUsd) * 100
      ),
    })),
    mainTokenAmountUsd: totalUsd,
  };
};
