import { markRaw } from "vue";
import { formatUnits, type Address, type PublicClient } from "viem";
import chainLinkAbi from "@/abis/chainLink";
import { calculateAPR } from "@/helpers/farm/getRewardTokenApy";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { FarmConfig, FarmItem } from "@/configs/farms/types";
// import { getRewardTokenApy} from "@/helpers/farm/getRewardTokenApy";

export type RewardPrice = {
  latestAnswer: bigint | undefined;
  address: Address;
}

export const createMultiRewardFarm = async (config: FarmConfig, account: Address | undefined) => {
  const publicClient = getPublicClient(config.contractChain);

  const { stakingToken, contract } = config;

  const [virtualPrice, totalSupply] = await publicClient.multicall({
    chainId: config.contractChain,
    contracts: [
      {
        address: stakingToken.address,
        abi: stakingToken.abi,
        functionName: "get_virtual_price",
        args: [],
      },
      {
        address: contract.address,
        abi: contract.abi,
        functionName: "totalSupply",
        args: [],
      },
    ],
  });

  const rewardPrices = await Promise.all(
    config.rewardTokens!.map(async (tokenInfo) => {
      const latestAnswer = await publicClient.readContract({
        address: tokenInfo.oracle,
        abi: chainLinkAbi,
        functionName: "latestAnswer",
      });

      return {
        latestAnswer,
        address: tokenInfo.address,
      };
    })
  );

  const { totalApr, tokensApr } = await calculateAPR(
    contract.address,
    contract.abi,
    formatUnits(virtualPrice.result, stakingToken.decimals),
    rewardPrices.map((item) => {
      return {
        address: item.address,
        price: formatUnits(item.latestAnswer, 8),
      };
    }),
    publicClient
  );

  // const rewardsApy = await Promise.all(
  //   config.rewardTokens.map(async (tokenInfo) => {
  //     const apy = await getRewardTokenApy(
  //       contract.address,
  //       contract.abi,
  //       tokenInfo.address
  //     );

  //     return {
  //       apy,
  //       address: tokenInfo.address,
  //     };
  //   })
  // );

  const farmTvl =
    Number(formatUnits(totalSupply.result, stakingToken.decimals)) *
    Number(formatUnits(virtualPrice.result, stakingToken.decimals));

  // const apy = rewardsApy.reduce(
  //   (accumulator, currentItem) => accumulator + currentItem.apy,
  //   0
  // );

  const farmItem: FarmItem = {
    config,
    name: config.name,
    icon: config.icon,
    id: config.id,
    chainId: config.contractChain,
    isMultiReward: true,
    stakingToken: {
      link: config.stakingToken.link,
      name: config.stakingToken.name,
      type: config.stakingToken.type,
      contractInfo: {
        address: config.stakingToken.address!,
        abi: config.stakingToken.abi,
      },
    },
    contractInfo: config.contract,
    farmRoi: totalApr, // TODO update ui
    lpPrice: Number(formatUnits(virtualPrice.result, stakingToken.decimals)), // TODO update ui
    tokensApr,
    farmTvl,
    isDeprecated: config.isDeprecated ? config.isDeprecated : false,
    isNew: config.isNew,
  };

  if (account)
    farmItem.accountInfo = await getUserInfo(
      config,
      rewardPrices,
      account,
      publicClient
    );

  return markRaw(farmItem);
};

const getUserInfo = async (config: FarmConfig, rewardPrices: RewardPrice[], account: Address, publicClient: PublicClient) => {
  const { contract, stakingToken } = config;

  const [stakedBalance, balance, allowance] = await publicClient.multicall({
    contracts: [
      {
        address: contract.address,
        abi: contract.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: stakingToken.address!,
        abi: stakingToken.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: stakingToken.address!,
        abi: stakingToken.abi,
        functionName: "allowance",
        args: [account, contract.address],
      },
    ],
  });

  const rewardTokensInfo = await Promise.all(
    config.rewardTokens!.map(async (tokenInfo) => {
      const [balanceOf, allowance, rewards, earned] =
        await publicClient.multicall({
          contracts: [
            {
              address: tokenInfo.address,
              abi: tokenInfo.abi,
              functionName: "balanceOf",
              args: [account],
            },
            {
              address: tokenInfo.address,
              abi: tokenInfo.abi,
              functionName: "allowance",
              args: [account, contract.address],
            },
            {
              address: contract.address,
              abi: contract.abi,
              functionName: "rewards",
              args: [account, tokenInfo.address],
            },
            {
              address: contract.address,
              abi: contract.abi,
              functionName: "earned",
              args: [account, tokenInfo.address],
            },
          ],
        });

      const latestAnswer = rewardPrices!.find(
        (item) => item.address === tokenInfo.address
      )?.latestAnswer;

      const earnedFromatted = Number(formatUnits(earned.result as bigint, tokenInfo.decimals));
      const price = Number(formatUnits(latestAnswer || 0n, 8));
      return {
        balance: formatUnits(balanceOf.result as bigint, tokenInfo.decimals),
        allowance: formatUnits(allowance.result as bigint, tokenInfo.decimals),
        rewards: formatUnits(rewards.result as bigint, tokenInfo.decimals),
        earned: earnedFromatted,
        price,
        usd: (earnedFromatted * price).toString(),
        ...tokenInfo,
      };
    })
  );

  return {
    allowance: formatUnits(allowance.result  as bigint, stakingToken.decimals),
    balance: formatUnits(balance.result as bigint, stakingToken.decimals),
    depositedBalance: formatUnits(stakedBalance.result as bigint, stakingToken.decimals),
    // TODO
    userInfo: {
      amount: formatUnits(stakedBalance.result as bigint, stakingToken.decimals),
      amountBigInt: stakedBalance.result as bigint,
    },
    rewardTokensInfo,
  };
};
