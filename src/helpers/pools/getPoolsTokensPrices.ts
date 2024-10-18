import type { PoolConfig, TokenConfig } from "@/configs/pools/types";
import type { Address } from "viem";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";

export const getTokenPricesByChain = async (
  poolsConfigsOnChain: PoolConfig[],
  chainId: number
) => {
  if (!poolsConfigsOnChain) return [];

  const tokensAddresses = getTokensAddressess(poolsConfigsOnChain);
  return await getCoinsPrices(chainId, tokensAddresses);
};

export const getPoolTokensPrices = async (
  chainId: number,
  poolConfig: PoolConfig
) => {
  if (!poolConfig) return [];

  const tokensAddressessSet: Set<Address> = new Set();

  getPoolTokensAdressess(tokensAddressessSet, poolConfig);
  return await getCoinsPrices(chainId, Array.from(tokensAddressessSet));
};

const getTokensAddressess = (poolsConfigs: PoolConfig[]): Address[] => {
  const tokensAddressessSet: Set<Address> = new Set();

  poolsConfigs.forEach((config) =>
    getPoolTokensAdressess(tokensAddressessSet, config)
  );

  return Array.from(tokensAddressessSet);
};

const getPoolTokensAdressess = (
  tokensAddressessSet: Set<Address>,
  { baseToken, quoteToken, rewardTokens }: PoolConfig
) => {
  tokensAddressessSet.add(baseToken.contract.address);
  tokensAddressessSet.add(quoteToken.contract.address);

  if (rewardTokens && rewardTokens?.length > 0)
    rewardTokens.forEach((rewardToken: TokenConfig) =>
      tokensAddressessSet.add(rewardToken.contract.address)
    );
};
