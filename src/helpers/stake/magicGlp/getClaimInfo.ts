import { ethers } from "ethers";
import type { Address } from "viem";
// @ts-ignore
import lensAbi from "@/abis/marketLens.js";
import { useImage } from "@/helpers/useImage";
// @ts-ignore
import tokensAbi from "@/abis/tokensAbi/index";
import { formatUnits, numberToHex, pad } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { MarketInfoResponse } from "@/helpers/cauldron/getMainParams";

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
  }[];
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
      name: "GM (ETH/USDC)",
      decimals: 18,
      icon: useImage("@/assets/images/tokens/GM_ETH.png"),
      address: "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336",
      cauldron: "0x2b02bBeAb8eCAb792d3F4DDA7a76f63Aa21934FA",
    },
    {
      name: "GLP",
      decimals: 18,
      icon: useImage("@/assets/images/tokens/GLP.png"),
      address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
      cauldron: "0x5698135CA439f21a57bDdbe8b582C62f090406D5",
    },
  ],
  caldrons: [
    "0x726413d7402fF180609d0EBc79506df8633701B1",
    "0x2b02bBeAb8eCAb792d3F4DDA7a76f63Aa21934FA",
    "0x5698135CA439f21a57bDdbe8b582C62f090406D5",
  ],
  stateOverrides: [
    {
      // Set proper oracle
      address: "0x4ED0935ecC03D7FcEfb059e279BCD910a02F284C",
      stateDiff: [
        {
          slot: numberToHex(2, { size: 32 }),
          value: pad("0xa0fc5f7f1a72ae4842b89d5aa42fb8870b599a4b"),
        },
      ],
    },
    {
      // Set actual GLP token on MagicGLP
      address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
      stateDiff: [
        {
          slot: numberToHex(6, { size: 32 }),
          value: pad("0x5402b5f40310bded796c7d0f3ff6683f5c0cffdf"),
        },
      ],
    },
  ],
};

export const getClaimInfo = async (chainId: number, account: Address) => {
  const publicClient = getPublicClient(chainId);
  const stateOverride = config.stateOverrides;

  const lensAddress = getLensAddress(chainId);

  const marketInfo: MarketInfoResponse[] = await publicClient.multicall({
    contracts: config.caldrons.map((address) => {
      return {
        address: lensAddress,
        abi: lensAbi,
        functionName: "getMarketInfoCauldronV3",
        args: [address],
      };
    }),
    stateOverride,
  });

  if (!account) return getEmptyClaimInfo(marketInfo);

  const userMagicGlpBalance = await publicClient.readContract({
    address: config.mainToken.address,
    abi: config.mainToken.abi,
    functionName: "balanceOf",
    args: [account],
  });

  if (!userMagicGlpBalance) return getEmptyClaimInfo(marketInfo);

  const claimPreview = await getPreviewClaim(userMagicGlpBalance);

  // const claimPreview = await publicClient.readContract({
  //   address: config.mainToken.address,
  //   abi: config.mainToken.abi,
  //   functionName: "previewClaim",
  //   args: [userMagicGlpBalance],
  // });

  const parsedBalance = Number(
    formatUnits(userMagicGlpBalance, config.mainToken.decimals)
  );

  const price = Number(
    formatUnits(marketInfo[0].result.collateralPrice, config.mainToken.decimals)
  );

  return {
    mainToken: {
      ...config.mainToken,
      price: marketInfo[0].result.collateralPrice,
      balance: userMagicGlpBalance,
      parsedBalance: formatTokenBalance(parsedBalance),
      balanceUsd: formatUSD(parsedBalance * price),
    },
    rewards: config.rewards.map((reward, index) => {
      const price = Number(
        formatUnits(
          marketInfo[index + 1].result.collateralPrice,
          reward.decimals
        )
      );

      const claimAmount = Number(
        formatUnits(
          claimPreview.find((item: any) => item.token === reward.address)
            ?.amount || 0n,
          reward.decimals
        )
      );

      return {
        ...reward,
        price,
        claimAmount: formatTokenBalance(claimAmount),
        claimAmountUsd: formatUSD(claimAmount * price),
      };
    }),
  };
};

const getEmptyClaimInfo = (marketInfo: MarketInfoResponse[]) => {
  return {
    mainToken: {
      ...config.mainToken,
      price: marketInfo[0].result.collateralPrice,
      balance: 0n,
      parsedBalance: formatTokenBalance(0),
      balanceUsd: formatUSD(0),
    },

    rewards: config.rewards.map((reward, index) => {
      return {
        ...reward,
        price: Number(
          formatUnits(
            marketInfo[index + 1].result.collateralPrice,
            reward.decimals
          )
        ),
        claimAmount: formatTokenBalance(0),
        claimAmountUsd: formatUSD(0),
      };
    }),
  };
};

const getPreviewClaim = async (userBalance: bigint) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://virtual.arbitrum.eu.rpc.tenderly.co/ad8fb495-a9f7-45a3-9e9a-85650d98ba8d"
  );

  const contract = new ethers.Contract(
    config.mainToken.address,
    config.mainToken.abi,
    provider
  );

  return await contract.previewClaim(userBalance);
};
