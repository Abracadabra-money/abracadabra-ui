import {
  magicKlpConfig,
  type ChainConfig,
} from "@/configs/stake/magicKlpConfig";
import { useImage } from "@/helpers/useImage";
import { KAVA_CHAIN_ID } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { ONE_ETHER_VIEM, RANDOM_ACCOUNT } from "@/constants/global";
import type { MagicKlpStakeInfo } from "@/helpers/stake/magicKLP/types";

const { mainToken, stakeToken } =
  magicKlpConfig[KAVA_CHAIN_ID as keyof typeof magicKlpConfig];

export const emptyState: MagicKlpStakeInfo = {
  chainId: KAVA_CHAIN_ID,
  mainToken: {
    name: mainToken.name,
    icon: mainToken.icon,
    balance: 0n,
    price: 0n,
    balanceUsd: 0n,
    rate: ONE_ETHER_VIEM,
    decimals: 18,
    rateIcon: useImage("assets/images/tokens/KLP.png"),
    totalSupply: 0n,
    totalSupplyUsd: 0n,
    contract: mainToken.contract,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    price: 0n,
    balance: 0n,
    balanceUsd: 0n,
    decimals: stakeToken.decimals,
    contract: stakeToken.contract,
    approvedAmount: 0n,
    lastAdded: "",
  },
};

export const getEmptyState = async (config: ChainConfig, chainId: number) => {
  if (!config) return emptyState;
  const { mainToken, manager, reader } = config;

  const publicClient = getPublicClient(KAVA_CHAIN_ID);

  const [totalSupply, aums, tokenBalancesWithSupplies, tokensRate] =
    await publicClient.multicall({
      contracts: [
        {
          ...mainToken.contract,
          functionName: "totalSupply",
          args: [],
        },
        {
          ...manager.contract,
          functionName: "getAums",
          args: [],
        },
        {
          ...reader.contract,
          functionName: "getTokenBalancesWithSupplies",
          args: [RANDOM_ACCOUNT, [stakeToken.contract.address]],
        },
        {
          ...mainToken.contract,
          functionName: "convertToAssets",
          args: [ONE_ETHER_VIEM],
        },
      ],
    });

  const aum: bigint = aums.result[0];
  const klpSupply: bigint = tokenBalancesWithSupplies.result[1];
  const stakeTokenPrice = (aum * 1000000n) / klpSupply;
  const mainTokenPrice = (stakeTokenPrice * tokensRate.result) / ONE_ETHER_VIEM;
  const totalSupplyUsd =
    ((totalSupply.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;
  emptyState.mainToken.totalSupply = totalSupply.result as bigint;
  emptyState.mainToken.totalSupplyUsd = totalSupplyUsd;
  emptyState.mainToken.price = mainTokenPrice;
  emptyState.stakeToken.price = stakeTokenPrice;
  emptyState.chainId = chainId;
  return {
    ...emptyState,
  };
};
