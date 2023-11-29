import { multicall } from "@wagmi/core";
import { formatUnits, createPublicClient, http } from "viem";
import chainLinkAbi from "@/utils/abi/chainLink";
import { chainsList } from "@/helpers/chains";
import { getRewardTokenApy } from "./getRewardTokenApy";

export const createMultiRewardFarm = async (config, account) => {
  const chain = chainsList[config.contractChain];

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  console.log(publicClient);

  const { stakingToken, contract } = config;

  const [virtualPrice, totalSupply] = await multicall({
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
    config.rewardTokens.map(async (tokenInfo) => {
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

  const rewardsApy = await Promise.all(
    config.rewardTokens.map(async (tokenInfo) => {
      const apy = await getRewardTokenApy(
        contract.address,
        contract.abi,
        tokenInfo.address
      );

      return {
        apy,
        address: tokenInfo.address,
      };
    })
  );

  const farmTvl = Number(
    formatUnits(totalSupply.result, stakingToken.decimals) *
      formatUnits(virtualPrice.result, stakingToken.decimals)
  );

  const apy = rewardsApy.reduce(
    (accumulator, currentItem) => accumulator + currentItem.apy,
    0
  );

  const farmItem = {
    name: config.name,
    icon: config.icon,
    id: config.id,
    isMultiReward: true,
    stakingToken: {
      link: config.stakingToken.link,
      name: config.stakingToken.name,
      type: config.stakingToken.type,
      contractInfo: {
        address: config.stakingToken.address,
        abi: config.stakingToken.abi,
      },
    },
    contractInfo: config.contract,
    farmRoi: apy, // TODO update ui
    lpPrice: Number(virtualPrice.result), // TODO update ui
    farmTvl,
    isDepreciated: false, // TODO fix naming
  };

  if (account)
    farmItem.accountInfo = await getUserInfo(config, rewardPrices, account);

  console.log("farmItem", farmItem);

  return farmItem;
};

const getUserInfo = async (config, rewardPrices, account) => {
  const { contract, stakingToken } = config;

  const [stakedBalance, balance, allowance] = await multicall({
    contracts: [
      {
        address: contract.address,
        abi: contract.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: stakingToken.address,
        abi: stakingToken.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: stakingToken.address,
        abi: stakingToken.abi,
        functionName: "allowance",
        args: [account, contract.address],
      },
    ],
  });

  const rewardTokensInfo = await Promise.all(
    config.rewardTokens.map(async (tokenInfo) => {
      const [balanceOf, allowance, rewards, earned] = await multicall({
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

      const latestAnswer = rewardPrices.find(
        (item) => item.address === tokenInfo.address
      ).latestAnswer;

      return {
        balance: formatUnits(balanceOf.result, tokenInfo.decimals),
        allowance: formatUnits(allowance.result, tokenInfo.decimals),
        rewards: formatUnits(rewards.result, tokenInfo.decimals),
        earned: formatUnits(earned.result, tokenInfo.decimals),
        price: formatUnits(latestAnswer, 8),
        ...tokenInfo,
      };
    })
  );

  return {
    allowance: formatUnits(allowance.result, stakingToken.decimals),
    balance: formatUnits(balance.result, stakingToken.decimals),
    depositedBalance: formatUnits(stakedBalance.result, stakingToken.decimals),
    // TODO
    userInfo: {
      amount: formatUnits(stakedBalance.result, stakingToken.decimals),
    },
    rewardTokensInfo,
  };
};

// const getRewardTokenApy = async (
//   contractInfo,
//   expectedStakeAmount, // $1000
//   totalSupply,
//   rewardToken,
//   rewardTokenPrice
// ) => {
//   try {
//     const [rewardData, rewardPerToken] = await multicall({
//       contracts: [
//         {
//           address: contractInfo.address,
//           abi: contractInfo.abi,
//           functionName: "rewardData",
//           args: [rewardToken],
//         },
//         {
//           address: contractInfo.address,
//           abi: contractInfo.abi,
//           functionName: "rewardPerToken",
//           args: [rewardToken],
//         },
//       ],
//     });

//     // parsedAmount $1000 staked tokens
//     const divide = totalSupply + expectedStakeAmount;

//     const multiplier = 86400n;

//     // per week
//     const tokenReward = multiplier * rewardData.result.rewardRate;

//     const power = BigInt(1e18);

//     let loacalAccTokenPerShare =
//       rewardPerToken.result + (tokenReward * power) / divide;

//     const accTokenPerShareConst =
//       loacalAccTokenPerShare + (tokenReward * power) / divide;

//     const rewardDebt = (expectedStakeAmount * loacalAccTokenPerShare) / power;

//     const pending = (expectedStakeAmount * accTokenPerShareConst) / power - rewardDebt;

//     const pendingUSD = formatUnits(pending, 18) * rewardTokenPrice;
//     const apy = ((pendingUSD * 100) / 1000) * 365;

//     return apy;
//   } catch (error) {
//     console.log("getFarmYield", error);
//     return 0;
//   }
// };
