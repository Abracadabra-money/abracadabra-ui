import { useImage } from "@/helpers/useImage";
import { createPublicClient, http } from "viem";
import { KAVA_CHAIN_ID } from "@/constants/global";
import { kavaConfig } from "@/helpers/chains/configs/kava";
import type { EmptyState } from "@/types/magicKlp/stakeInfo";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";
import { ONE_ETHER_VIEM, RANDOM_ACCOUNT } from "@/constants/global";

const { mainToken, stakeToken } =
  magicKlpConfig[KAVA_CHAIN_ID as keyof typeof magicKlpConfig];

export const emptyState: EmptyState = {
  mainToken: {
    name: mainToken.name,
    icon: mainToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    rate: ONE_ETHER_VIEM,
    decimals: 18,
    rateIcon: useImage("assets/images/tokens/KLP.png"),
    totalSupply: 0n,
    totalSupplyUsd: 0n,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
  },
};

export const getEmptyState = async (config: any) => {
  if (!config) return emptyState;
  const { mainToken, manager, reader } = config;

  // todo new chain config
  const publicClient = createPublicClient({
    // @ts-ignore
    chain: kavaConfig,
    transport: http(),
  });

  const [totalSupply, aums, tokenBalancesWithSupplies, tokensRate]: any =
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

  const aum = aums.result[0];
  const klpSupply = tokenBalancesWithSupplies.result[1];
  const stakeTokenPrice = (aum * 1000000n) / klpSupply;
  const mainTokenPrice = (stakeTokenPrice * tokensRate.result) / ONE_ETHER_VIEM;
  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;
  emptyState.mainToken.totalSupply = totalSupply.result;
  emptyState.mainToken.totalSupplyUsd = totalSupplyUsd;
  return emptyState;
};
